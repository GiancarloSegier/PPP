import {action, observable, decorate, configure} from 'mobx';
class WikiStore {
  wikiInfo = {};
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  collectInfo = async searchTerm => {
    const r = await fetch(
      `https://en.wikipedia.org//w/api.php?action=query&format=json&prop=extracts&description&titles=${searchTerm}&exchars=1300&explaintext=1`,
    );

    const text = await r.json();
    const pageObject = text.query.pages;
    const pageInformation = pageObject[Object.keys(pageObject)[0]];

    const paragraph = {};
    this.paragraphs = [];
    if (pageInformation.extract) {
      const plainText = pageInformation.extract.split('==');
      const infoArray = plainText[0].split('\n');

      for (let i = 0; i < infoArray.length; i++) {
        paragraph[i] = {id: i, text: infoArray[i]};
        if (paragraph[i].text !== '') {
          this.paragraphs.push(paragraph[i]);
        }
      }
    }

    if (this.paragraphs[0]) {
      this.paragraphs = this.paragraphs[0];
    }

    this.wikiInfo = {
      title: searchTerm,
      loadingInfo: false,
      wikiURL: `https://en.wikipedia.org/wiki/${searchTerm}`,
      placeInfo: this.paragraphs,
    };
  };
}

decorate(WikiStore, {
  collectInfo: action,
  wikiInfo: observable,
  googleAPI: observable,
});

export default WikiStore;
