
const calculateCost = () => {
    const sum = document.querySelector('.art-order__order h2')
    const activeFrame = +document.querySelector('.activeFrame').dataset.cost;
    const meters = document.querySelector('#artLength').value / 100;
    const paspart = document.querySelector('#paspart').value;
    const amount = document.querySelector('#amount').value;
    const frameCost = ((4 * meters) + (4 * meters) + (8 * 30) + (paspart * 5) + 10 + activeFrame) * amount

    sum.innerText = `${frameCost} BYN`
}

const selectFrame = (e) => {
    const activeFrame = document.querySelectorAll('.activeFrame');
    const frame = document.querySelector('.art-order__upper');
    [...activeFrame].forEach(item => item.classList.remove('activeFrame'));

    e.target.classList.add('activeFrame');
    frame.style = `background-image: url('${e.target.dataset.img}')`;

    calculateCost();
}

const validateArtLength = () => {
    const artLength = document.querySelector('#artLength');
    const artLengthRepeat = document.querySelector('#artLengthRepeat');

    const artValue = artLength.value.replace(/[^0-9]/g, '');
	if (artValue < 25) {
		artLength.value = 25;
	} else if (artValue > 225) {
		artLength.value = 225;
	} else {
		artLength.value = artValue;
	}
    artLengthRepeat.value = artLength.value;

    calculateCost();
}

const validatePaspartAndColor = () => {
    const paspart = document.querySelector('#paspart');
    const color = document.querySelector('#paspartColor');
    const artPaspart = document.querySelector('.art-order__middle')

    const paspartValue = paspart.value.replace(/[^0-9]/g, '');
    if (paspartValue < 0) {
        paspart.value = 0;
    } else if (paspartValue > 120) {
        paspart.value = 120;
    } else {
        paspart.value = paspartValue;
    }
    console.log(color.value, paspartValue);
    artPaspart.style = `padding: ${paspart.value}px; background: ${color.value}`;

    calculateCost();
}

export {validateArtLength, selectFrame, calculateCost, validatePaspartAndColor}