/**
 * THE BERG
 * Random backgrounds for LARGE bridge callouts
 */

(function () {

  const scriptURL = document.currentScript.src;

  const imageFolder = new URL(
    "../img/large-Bridge-Callout/",
    scriptURL
  );

  const imageFiles = [
    "large-callout1.jpg",
    "large-callout2.jpg",
    "large-callout3.jpg",
    "large-callout4.jpg",
    "large-callout5.jpg",
    "large-callout6.jpg",
    "large-callout7.jpg",
    "large-callout8.jpg",
    "large-callout9.jpg"
  ];


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


  function checkImage(url) {

    return new Promise((resolve) => {

      const img = new Image();

      img.onload = function () {
        resolve(url);
      };

      img.onerror = function () {

        console.warn(
          "LARGE BERG CALLOUT: Image not found:",
          url
        );

        resolve(null);
      };

      img.src = url;

    });

  }


  async function initLargeBridgeCallouts() {

    const cards = Array.from(
      document.querySelectorAll(
        ".article-callout--feature"
      )
    );

    if (!cards.length) {
      return;
    }


    const imageURLs =
      imageFiles.map(function (filename) {

        return new URL(
          filename,
          imageFolder
        ).href;

      });


    const checkedImages =
      await Promise.all(
        imageURLs.map(checkImage)
      );


    const validImages =
      checkedImages.filter(Boolean);


    if (!validImages.length) {

      console.warn(
        "LARGE BERG CALLOUT: No valid images found."
      );

      return;
    }


    let previousImages = [];

    try {

      previousImages =
        JSON.parse(
          sessionStorage.getItem(
            "bergLargeCalloutImages"
          )
        ) || [];

    } catch (error) {

      previousImages = [];

    }


    const randomImages =
      shuffle(validImages);

    const usedImages = [];


    cards.forEach(function (card, index) {

      let choices =
        randomImages.filter(
          function (image) {

            return !usedImages.includes(
              image
            );

          }
        );


      if (!choices.length) {
        choices = [...randomImages];
      }


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


      const chosenImage =
        choices[
          Math.floor(
            Math.random() *
            choices.length
          )
        ];


      card.style.setProperty(
        "--large-callout-image",
        'url("' + chosenImage + '")'
      );


      usedImages.push(
        chosenImage
      );

    });


    try {

      sessionStorage.setItem(
        "bergLargeCalloutImages",
        JSON.stringify(
          usedImages
        )
      );

    } catch (error) {

      // Safe to ignore

    }

  }


  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      initLargeBridgeCallouts,
      { once: true }
    );

  } else {

    initLargeBridgeCallouts();

  }

})();