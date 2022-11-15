export async function fetchCountries(name) {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
    );
    return await response.json();
  } catch (error) {
    return console.log(error);
  }
}
// fetchCountries('Ukraine');
