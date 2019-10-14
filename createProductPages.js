const standardFS = require("fs");
const fs = require("fs").promises;
const randomWords = require("random-words");
const rimraf = require("rimraf");

const PAGES_TO_GENERATE = 1000;

// Helper function
const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

const metaData = [];

// Create products folder if it doesn't exists
const productsFolder = "./src/routes/products";
if (!standardFS.existsSync(productsFolder)) {
  standardFS.mkdirSync(productsFolder);
  console.log("Products folder created.");
}

// Delete old product pages
rimraf("./src/routes/products/*", async () => {
  console.log("-> Old product pages are deleted.");

  // Generate Svelte pages
  const pages = [];

  // index page
  const indexPage = fs.writeFile(
    `./src/routes/products/index.svelte`,
    `
<script context="module">
import products from './_products.js';
</script>

<style>
  ul {
    margin: 0 0 1em 0;
    line-height: 1.5;
  }
</style>

<svelte:head>
  <title>Products</title>
</svelte:head>

<h1>All products</h1>

<ul>
  {#each products as product}
    <!-- we're using the non-standard "rel=prefetch" attribute to
        tell Sapper to load the data for the page as soon as
        the user hovers over the link or taps it, instead of
        waiting for the 'click' event -->
    <li><a rel='prefetch' href='products/{product.slug}'>{product.title}</a></li>
  {/each}
</ul>`,
    function(err) {
      if (err) {
        return console.log(err);
      }
    }
  );

  pages.push(indexPage);

  // Product pages
  for (let i = 0; i < PAGES_TO_GENERATE; i++) {
    const firstWord = randomWords();
    const secondWord = randomWords();
    const title = `${capitalize(firstWord)} ${secondWord}`;
    const slug = `${firstWord}-${secondWord}`;

    metaData.push({ title, slug });

    const productPage = fs.writeFile(
      `./src/routes/products/${slug}.svelte`,
      `
<script>
  import MyComponent from '../../components/MyComponent.svelte';

  export let myComponent;
</script>

<style>
  p {
    font-size: 18px;
  }
</style>

<svelte:head>
  <title>${title}</title>
</svelte:head>

<h1>${title} ${randomWords({ min: 3, max: 5 }).join(" ")}</h1>

<MyComponent {myComponent}/>

<p>P${randomWords({ min: 30, max: 50 }).join(" ")}.</p>`,
      function(err) {
        if (err) {
          return console.log(err);
        }
      }
    );

    pages.push(productPage);
  }

  await Promise.all(pages);

  console.log("-> Done generating pages.");

  // Generate metadata.
  fs.writeFile(
    `./src/routes/products/_products.js`,
    `
      export default ${JSON.stringify(metaData)}
      `,
    function(err) {
      if (err) {
        return console.log(err);
      }

      console.log("-> Meta data done");
    }
  );

  console.log("-> Done generating meta file.");
});
