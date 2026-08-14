/**
 * THE BERG
 * Random bridge callout background images
 */

(function () {

  /*
   * Get the location of THIS JavaScript file.
   *
   * Example:
   * assets/js/bridge-callouts.js
   */
  const scriptURL = document.currentScript.src;


  /*
   * Work out the image folder relative to this JS file.
   *
   * JS:
   * assets/js/bridge-callouts.js
   *
   * Images:
   * assets/img/bridge-callout/
   */
  const imageFolder = new URL(
    "../img/bridge-callout/",
    scriptURL
  );


  /*
   * ADD YOUR IMAGE FILENAMES HERE
   */
  const imageFiles = [
    "bridge-callout1.jpg",
    "bridge-callout2.jpg",
    "bridge-callout3.jpg",
    "bridge-callout4.jpg",
    "bridge-callout5.jpg",
    "bridge-callout6.jpg",
    "bridge-callout7.jpg",
    "bridge-callout8.jpg",
    "bridge-callout9.jpg"
  ];


  /* ---------------------------------------------------------
     Shuffle array
     --------------------------------------------------------- */

  function shuffle(array) {

    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {

      const j = Math.floor(
        Math.random() * (i + 1)
      );

      [copy[i], copy[j]] =
        [copy[j], copy[i]];
    }

    return copy;
  }


  /* ---------------------------------------------------------
     Check image exists
     --------------------------------------------------------- */

  function checkImage(url) {

    return new Promise((resolve) => {

      const img = new Image();

      img.onload = function () {
        resolve(url);
      };

      img.onerror = function () {

        console.warn(
          "BERG CALLOUT: Image not found:",
          url
        );

        resolve(null);
      };

      img.src = url;

    });

  }


  /* ---------------------------------------------------------
     Initialise
     --------------------------------------------------------- */

  async function initBridgeCallouts() {

    const cards = Array.from(
      document.querySelectorAll(".bridge-callout")
    );


    /*
     * No callouts on this page?
     * Do nothing.
     */
    if (!cards.length) {
      return;
    }


    /*
     * Build complete image URLs
     */
    const imageURLs = imageFiles.map(
      function (filename) {

        return new URL(
          filename,
          imageFolder
        ).href;

      }
    );


    /*
     * Check which images actually exist
     */
    const checkedImages = await Promise.all(
      imageURLs.map(checkImage)
    );


    /*
     * Remove missing images
     */
    const validImages =
      checkedImages.filter(Boolean);


    /*
     * If none exist, leave CSS fallback images
     */
    if (!validImages.length) {

      console.warn(
        "BERG CALLOUT: No valid background images found."
      );

      return;
    }


    /*
     * Randomise image order
     */
    const randomImages =
      shuffle(validImages);


    /*
     * Retrieve previous images
     */
    let previousImages = [];

    try {

      previousImages =
        JSON.parse(
          sessionStorage.getItem(
            "bergCalloutImages"
          )
        ) || [];

    } catch (error) {

      previousImages = [];

    }


    const usedImages = [];


    /* -------------------------------------------------------
       Assign images
       ------------------------------------------------------- */

    cards.forEach(
      function (card, index) {

        /*
         * Prefer images not already used
         * on this page.
         */
        let choices =
          randomImages.filter(
            function (image) {

              return !usedImages.includes(
                image
              );

            }
          );


        /*
         * If we've run out of unique images,
         * allow reuse.
         */
        if (!choices.length) {

          choices =
            [...randomImages];

        }


        /*
         * Try not to repeat the same image
         * this card had before refresh.
         */
        const nonRepeat =
          choices.filter(
            function (image) {

              return image !==
                previousImages[index];

            }
          );


        if (nonRepeat.length) {

          choices = nonRepeat;

        }


        /*
         * Choose image
         */
        const chosenImage =
          choices[
            Math.floor(
              Math.random() *
              choices.length
            )
          ];


        /*
         * Send image into CSS
         */
        card.style.setProperty(
          "--callout-image",
          'url("' + chosenImage + '")'
        );


        usedImages.push(
          chosenImage
        );

      }
    );


    /*
     * Remember selection for next refresh
     */
    try {

      sessionStorage.setItem(
        "bergCalloutImages",
        JSON.stringify(
          usedImages
        )
      );

    } catch (error) {

      // Safe to ignore

    }


    console.log(
      "BERG CALLOUT:",
      cards.length,
      "callouts loaded with random backgrounds."
    );

  }


  /* ---------------------------------------------------------
     Run safely whether DOM has loaded or not
     --------------------------------------------------------- */

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initBridgeCallouts,
      { once: true }
    );

  } else {

    initBridgeCallouts();

  }

})();