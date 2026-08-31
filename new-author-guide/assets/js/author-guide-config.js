(function () {
      var url = new URL(window.location.href);
      var experience = url.searchParams.get("experience");
      var lab = url.searchParams.get("lab");
      var fullGuideHref = "https://" + "oracle-livelabs" + ".github.io/common/sample-livelabs-templates/create-labs/labs/workshops/livelabs/";
      var workshopExampleHref = "https://oracle-livelabs.github.io/developer/dev-ai-app-dev-finance/workshops/sandbox/";
      var wmsHref = "https://apex.oraclecorp.com/pls/apex/f?p=LIVELABS";
      var markdownLabMap = {
        "start-here": "introduction",
        "core-workflow": "1-labs-wms",
        "core-workshop-flow": "1-labs-wms",
        "validation-publish": "5-labs-qa-checks",
        "reuse-enhancements": "11-create-freesql",
        "tools-productivity": "13-labs-capture-screens-best-practices",
        "specialized-workflows": "10-create-sprints-workflow",
        "help-faq": "introduction"
      };
      var target;

      function guideRootUrl() {
        var current = new URL(window.location.href);
        var segments = current.pathname.split("/").filter(Boolean);
        var routeNames = ["home", "quickstart", "cheatsheet", "nodoc"];
        var lastSegment = segments[segments.length - 1] || "";

        if (routeNames.indexOf(lastSegment) !== -1) {
          segments.pop();
        } else if (segments.length > 1 && segments[segments.length - 2] === "pages") {
          segments.splice(-2, 2);
        }

        return new URL("/" + (segments.length ? segments.join("/") + "/" : ""), current.origin);
      }

      function assetUrl(path, baseUrl) {
        var logicalPath;

        if (!path || /^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(path)) {
          return path || "";
        }

        logicalPath = path.replace(/^(?:\.\.\/)+/, "");
        return new URL(logicalPath, baseUrl || guideRootUrl()).toString();
      }

      function hydrateAssets(root) {
        (root || document).querySelectorAll("img[data-guide-asset], img[src]").forEach(function (image) {
          var source = image.getAttribute("data-guide-asset") || image.getAttribute("src");

          if (/^(?:\.\.\/)+content\//.test(source || "") || image.hasAttribute("data-guide-asset")) {
            image.setAttribute("src", assetUrl(source));
          }
        });
      }

      window.authorGuideFullGuideHref = fullGuideHref;
      window.authorGuideWorkshopExampleHref = workshopExampleHref;
      window.authorGuideWmsHref = wmsHref;
      window.AuthorGuideAssets = {
        resolve: assetUrl,
        hydrate: hydrateAssets
      };
      document.addEventListener("DOMContentLoaded", function () {
        hydrateAssets();
        document.querySelectorAll("[data-full-guide-link]").forEach(function (link) {
          link.href = fullGuideHref;
        });
        document.querySelectorAll("[data-workshop-example-link]").forEach(function (link) {
          link.href = workshopExampleHref;
        });
        document.querySelectorAll("[data-wms-link]").forEach(function (link) {
          link.href = wmsHref;
        });
      });

      if (experience === "classic" || experience === "markdown") {
        target = new URL(fullGuideHref);
        window.location.replace(target.toString());
        return;
      }

      if (!lab) {
        return;
      }

      if (markdownLabMap[lab]) {
        url.searchParams.set("lab", markdownLabMap[lab]);
      }

      target = new URL(fullGuideHref);
      target.search = url.search;
      window.location.replace(target.toString());
    }());
