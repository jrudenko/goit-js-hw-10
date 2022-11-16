import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
// import templateFunctionList from './templates/сountry-list.hbs';
// import templateFunctionInfo from './templates/country-info.hbs';

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
  // return countries.map(templateFunctionList).join('');
  const markup = countries
    .map(({ name, flags }) => {
      return `
          <table class="country-list__item">
    <tr>
        <td>
            <img align="middle" class="country-list__flag" src="${flags.svg}" alt="Flag of  ${name.official}" width=40px height=40px>
        </td>
        <td>
            <h2 align="middle" class="country-list__name">${name.official}</h2>
        </td>
    </tr>
</table>
          `;
    })
    .join('');
  return markup;
}

function renderCountryInfo(countries) {
  // return countries.map(templateFunctionInfo).join('');
  const markup = countries
    .map(({ capital, population, languages }) => {
      return `
        <table >
    <tr class="country-info">
        <td>
            <p class="capital"><span class="text"><b>Capital: </b></span>${capital}</p>
        </td>
    </tr>
    <tr class="country-info">
        <td>
            <p class="population"><span class="text"><b>Population: </b></span>${population}</p>
        </td>
    </tr>
    <tr class="country-info">
        <td>
           <p class="languages"><b>Languages: </b>${Object.values(
             languages
           ).join(', ')}</p>
        </td>
    </tr>
</table>
        `;
    })
    .join('');
  return markup;
}

function warnWrongName() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function warnTooManyMatches() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
