const objectRange = document.getElementById('objectRange');
const boxRange = document.getElementById('boxRange');
const scenarioSelect = document.getElementById('scenarioSelect');
const waitingObjects = document.getElementById('waitingObjects');
const boxGrid = document.getElementById('boxGrid');
const simulationCaption = document.getElementById('simulationCaption');
const statusTitle = document.getElementById('statusTitle');
const statusText = document.getElementById('statusText');
const statusDot = document.getElementById('statusDot');
const guarantee = document.getElementById('guarantee');
let timer;
let simulationId = 0;

const scenarios = {
  custom: {
    objects: 8, boxes: 5, token: 'O', box: 'Box',
    caption: 'Numbered objects are placed into simple boxes.',
    labels: count => Array.from({ length: count }, (_, index) => `Box ${index + 1}`)
  },
  students: {
    objects: 25, boxes: 12, token: 'S', box: 'month',
    caption: 'Each student is grouped by their birth month.',
    labels: () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  birthdays: {
    objects: 8, boxes: 7, token: 'P', box: 'day',
    caption: 'Each person is placed on one day of a seven-day birthday week.',
    labels: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  codes: {
    objects: 20, boxes: 10, token: 'U', box: 'code',
    caption: 'Each user receives one of a limited set of access codes.',
    labels: count => Array.from({ length: count }, (_, index) => `CODE-${String(index + 1).padStart(2, '0')}`)
  }
};

const values = () => ({ objects: Number(objectRange.value), boxes: Number(boxRange.value) });
const tokenMarkup = (number, scenario) => `<span class="object ${scenario.key}-object" aria-label="${scenario.token} ${number}">${scenario.token}${number}</span>`;

function currentScenario() {
  return { ...scenarios[scenarioSelect.value], key: scenarioSelect.value };
}

function renderReady() {
  simulationId += 1;
  clearTimeout(timer);
  const { objects, boxes } = values();
  const scenario = currentScenario();
  const labels = scenario.labels(boxes).slice(0, boxes);
  document.getElementById('objectValue').value = objects;
  document.getElementById('boxValue').value = boxes;
  simulationCaption.textContent = scenario.caption;
  waitingObjects.innerHTML = Array.from({ length: objects }, (_, index) => tokenMarkup(index + 1, scenario)).join('');
  boxGrid.className = `box-grid ${scenario.key}`;
  boxGrid.innerHTML = labels.map(label => `<article class="box"><div class="box-head"><span>${label}</span><b>0</b></div><div class="box-objects"></div></article>`).join('');
  statusTitle.textContent = 'Ready to explore';
  statusText.textContent = 'Press "Drop objects" to watch the distribution.';
  statusDot.classList.remove('collision');
  const minimum = Math.ceil(objects / boxes);
  guarantee.textContent = `Guaranteed: at least one ${scenario.box} contains ${minimum} item${minimum === 1 ? '' : 's'}.`;
}

function finish(slots, scenario) {
  const collisions = slots.filter(slot => slot.length > 1).length;
  statusDot.classList.toggle('collision', collisions > 0);
  statusTitle.textContent = collisions ? 'Collision found' : 'No collision yet';
  statusText.textContent = collisions
    ? `${collisions} ${scenario.box}${collisions === 1 ? '' : 's'} contain more than one ${scenario.token === 'S' ? 'student' : scenario.token === 'P' ? 'person' : scenario.token === 'U' ? 'user' : 'object'}.`
    : 'There are enough spaces for every item to remain separate.';
}

async function dropObjects() {
  const requested = values();
  const scenario = currentScenario();
  statusTitle.textContent = 'Contacting C++ backend...';
  statusText.textContent = 'Calculating the distribution.';
  let result;
  try {
    const response = await fetch(`http://localhost:8080/api/simulate?objects=${requested.objects}&boxes=${requested.boxes}`);
    if (!response.ok) throw new Error('Backend request failed');
    result = await response.json();
  } catch (error) {
    statusTitle.textContent = 'Backend is not running';
    statusText.textContent = 'Start the C++ API, then run the simulation again.';
    return;
  }
  const { objects, boxes, assignments } = result;
  const slots = Array.from({ length: boxes }, () => []);
  renderReady();
  const activeSimulation = simulationId;
  statusTitle.textContent = 'Distributing items...';
  statusText.textContent = scenario.caption;
  Array.from({ length: objects }, (_, index) => index + 1).forEach((object, index) => {
    timer = setTimeout(() => {
      if (activeSimulation !== simulationId) return;
      const boxIndex = assignments[index];
      slots[boxIndex].push(object);
      waitingObjects.children[index].classList.add('moving');
      const box = boxGrid.children[boxIndex];
      box.querySelector('.box-objects').insertAdjacentHTML('beforeend', tokenMarkup(object, scenario));
      box.querySelector('b').textContent = slots[boxIndex].length;
      if (slots[boxIndex].length > 1) box.classList.add('has-collision');
      if (index === objects - 1) finish(slots, scenario);
    }, index * 110);
  });
}

objectRange.addEventListener('input', () => { scenarioSelect.value = 'custom'; renderReady(); });
boxRange.addEventListener('input', () => { scenarioSelect.value = 'custom'; renderReady(); });
scenarioSelect.addEventListener('change', () => {
  const scenario = scenarios[scenarioSelect.value];
  objectRange.value = scenario.objects;
  boxRange.value = scenario.boxes;
  renderReady();
});
document.getElementById('dropButton').addEventListener('click', dropObjects);
document.getElementById('resetButton').addEventListener('click', renderReady);
renderReady();
