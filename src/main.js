import './styles/main.css';

import Alpine from 'alpinejs';

import rules from './rules';

window.Alpine = Alpine;

Alpine.data('theApp', rules);

Alpine.start();
