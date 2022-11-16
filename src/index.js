import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
import templateFunctionList from './templates/сountry-list.hbs';
import templateFunctionInfo from './templates/country-info.hbs';

const DEBOUNCE_DELAY = 300;
let getEl = selector => document.querySelector(selector);

// Handlebars.registerHelper('objValues', Object.values);

getEl('#search-box').addEventListener(
  'input',
  debounce(onCountryInput, DEBOUNCE_DELAY)
);

function onCountryInput() {
  const name = getEl('#search-box').value.trim();
  if (name === '') {
    return (
      (getEl('.country-list').innerHTML = ''),
      (getEl('.country-info').innerHTML = '')
    );
  }

  fetchCountries(name)
    .then(countries => {
      getEl('.country-list').innerHTML = '';
      getEl('.country-info').innerHTML = '';
      if (countries.length === 1) {
        getEl('.country-list').insertAdjacentHTML(
          'beforeend',
          renderCountryList(countries)
        );
        getEl('.country-info').insertAdjacentHTML(
          'beforeend',
          renderCountryInfo(countries)
        );
      } else if (countries.length >= 10) {
        warnTooManyMatches();
      } else {
        getEl('.country-list').insertAdjacentHTML(
          'beforeend',
          renderCountryList(countries)
        );
      }
    })
    .catch(warnWrongName);
}

function renderCountryList(countries) {
  return countries.map(templateFunctionList).join('');
}

function renderCountryInfo(countries) {
  return countries.map(templateFunctionInfo).join('');
}

function warnWrongName() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function warnTooManyMatches() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
