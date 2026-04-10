import Setting from './utils/setting.mjs';
import btnNavigateRefreshClick from '../index.mjs';

document.addEventListener('DOMContentLoaded', () => {
	init();
});

// default speed
const settings = {
	windUnits: { value: 2 },
	marineWindUnits: { value: 1 },
	marineWaveHeightUnits: { value: 1 },
	temperatureUnits: { value: 1 },
	distanceUnits: { value: 1 },
	pressureUnits: { value: 1 },
	hoursFormat: { value: 2 },
	speed: { value: 1.0 },
	experimentalFeatures: { value: false },
	hideWebamp: { value: false },
	kiosk: { value: false },
	scanLines: { value: false },
};

const init = () => {
	// Customizable measurement units
	settings.windUnits = new Setting('windUnits', 'Unità vento', 'select', 2, windUnitsChange, true, [
		[1, 'm/s'],
		[2, 'km/h'],
		[3, 'nodi'],
		[4, 'mph'],
		[5, 'bft']
	]);
	settings.marineWindUnits = new Setting('marineWindUnits', 'Unità vento (marine)', 'select', 1, marineWindUnitsChange, true, [
		[1, 'nodi'],
		[2, 'm/s'],
	]);
	settings.marineWaveHeightUnits = new Setting('marineWaveHeightUnits', 'Unità altezza onde', 'select', 1, marineWaveHeightUnitsChange, true, [
		[1, 'piedi'],
		[2, 'metri'],
	]);
	settings.temperatureUnits = new Setting('temperatureUnits', 'Unità temperatura', 'select', 1, temperatureChangeUnits, true, [
		[1, 'C'],
		[2, 'F'],
		[3, 'K'],
	]);
	settings.distanceUnits = new Setting('distanceUnits', 'Unità distanza', 'select', 1, distanceChangeUnits, true, [
		[1, 'chilometri'],
		[2, 'miglia'],
		[3, 'piedi'],
		[4, 'metri'],
		[5, 'bananas'],
	]);
	settings.pressureUnits = new Setting('pressureUnits', 'Unità pressione', 'select', 1, pressureChangeUnits, true, [
		[1, 'hPa'],
		[2, 'inHG'],
		[3, 'mmHG'],
	]);
	settings.hoursFormat = new Setting('hoursFormat', 'Formato orario', 'select', 2, hoursChangeFormat, true, [
		[1, '12 ore'],
		[2, '24 ore'],
	]);

	settings.speed = new Setting('speed', 'Velocità', 'select', 1.0, null, true, [
		[0.5, 'Molto veloce'],
		[0.75, 'Veloce'],
		[1.0, 'Normale'],
		[1.25, 'Lenta'],
		[1.5, 'Molto lenta'],
	]);
	settings.experimentalFeatures = new Setting(
		'experimentalFeatures',
		'Funzioni sperimentali <a href="https://github.com/mwood77/ws4kp-international?tab=readme-ov-file#updates-in-1100" target="_blank" rel="noopener noreferrer">(info)</a>',
		'checkbox',
		false,
		experimentalFeaturesChange,
		true,
	);
	settings.hideWebamp = new Setting('hideWebamp', 'Nascondi Webamp (Winamp)', 'checkbox', false, hideWebampChange, true);
	settings.scanLines = new Setting('scanLines', 'Linee di scansione', 'checkbox', false, scanLinesChange, true);

	settings.wide = new Setting('wide', 'Schermo largo', 'checkbox', false, wideScreenChange, true);
	settings.kiosk = new Setting('kiosk', 'Modalità chiosco', 'checkbox', false, kioskChange, false);

	// generate html objects
	const settingHtml = Object.values(settings).map((d) => d.generate());

	// write to page
	const settingsSection = document.querySelector('#settings');
	settingsSection.innerHTML = '';
	settingsSection.append(...settingHtml);
};

const temperatureChangeUnits = (value) => {
	if (value) {
		document.documentElement.setAttribute('temperature-units', value);
	}
};

const distanceChangeUnits = (value) => {
	if (value) {
		document.documentElement.setAttribute('distance-units', value);
	}
};

const pressureChangeUnits = (value) => {
	if (value) {
		document.documentElement.setAttribute('pressure-units', value);
	}
};

const marineWaveHeightUnitsChange = (value) => {
	if (value) {
		document.documentElement.setAttribute('marine-wave-height-units', value);
	}
};

const marineWindUnitsChange = (value) => {
	if (value) {
		document.documentElement.setAttribute('marine-wind-units', value);
	}
};

const windUnitsChange = (value) => {
	if (value) {
		document.documentElement.setAttribute('wind-units', value);
	}
};

const hoursChangeFormat = (value) => {
	if (value) {
		document.documentElement.setAttribute('hours-format', value);
	}
};

const experimentalFeaturesChange = (value) => {
	document.documentElement.setAttribute('experimental-features', value);

	// @todo - this is a bit gnarly
	if (!value) localStorage.removeItem('nearbyCitiesFromLocality');
	btnNavigateRefreshClick();
};

const hideWebampChange = async (value) => {
	if (value) {
		document.documentElement.setAttribute('hide-webamp', value);
	} else {
		document.documentElement.removeAttribute('hide-webamp');
	}

	// Webamp is a global variable, defined in a <script>
	// tag in index.ejs, so we can access it directly

	// Wait until the global webamp instance is available
	if (!window.webamp) {
		console.warn('Webamp not initialized yet.');
		return;
	}

	if (value === true) {
		// eslint-disable-next-line no-undef
		await webamp.close();
	} else {
		// eslint-disable-next-line no-undef
		await webamp.reopen();
	}
};

const scanLinesChange = (value) => {
	const container = document.querySelector('#divTwc');
	if (value) {
		container.classList.add('scan-lines');
	} else {
		container.classList.remove('scan-lines');
	}
};

const wideScreenChange = (value) => {
	const container = document.querySelector('#divTwc');
	if (value) {
		container.classList.add('wide');
	} else {
		container.classList.remove('wide');
	}
};

const kioskChange = (value) => {
	const body = document.querySelector('body');
	if (value) {
		body.classList.add('kiosk');
		window.dispatchEvent(new Event('resize'));
	} else {
		body.classList.remove('kiosk');
	}
};

export default settings;
