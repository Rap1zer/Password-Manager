const platformsArray = [
  {
    logo: "../images/logos/facebook.jpeg",
    name: "facebook",
  },
  {
    logo: "../images/logos/instagram.svg",
    name: "instagram",
  },
  {
    logo: "../images/logos/youtube.png",
    name: "youtube",
  },
  {
    logo: "../images/logos/linkedin.png",
    name: "linkedin",
  },
  {
    logo: "../images/logos/gmail.png",
    name: "gmail",
  },
  {
    logo: "../images/logos/amazon.png",
    name: "amazon",
  },
  {
    logo: "../images/logos/netflix.jpeg",
    name: "netflix",
  },
  {
    logo: "../images/logos/twitter.png",
    name: "twitter",
  },
];

// Create a Map from the array
const platforms = new Map();

for (const platform of platformsArray) {
  platforms.set(platform.name, platform.logo);
}
