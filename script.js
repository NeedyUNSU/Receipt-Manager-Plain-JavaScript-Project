
function Startup()
{
    let edits = document.getElementsByClassName("edit");
    let deletes = document.getElementsByClassName("delete");

    for(var i = 0; i < edits.length; i++) {
        edits[i].classList.add("hidden-element");
    }
    for(var i = 0; i < deletes.length; i++) {
        deletes[i].classList.add("hidden-element");
    }
}

function ControlsUi()
{
    let buf = document.getElementsByClassName("delete");
    if(buf[0].classList.contains("hidden-element"))
    {
        let deletes = document.getElementsByClassName("delete");
        for(var i = 0; i < deletes.length; i++) {
            deletes[i].classList.remove("hidden-element");
        }

        let edits = document.getElementsByClassName("edit");
        for(var i = 0; i < edits.length; i++) {
            edits[i].classList.remove("hidden-element");
        }
    }
    else
    {
        let deletes = document.getElementsByClassName("delete");
        for(var i = 0; i < deletes.length; i++) {
            deletes[i].classList.add("hidden-element");
        }

        let edits = document.getElementsByClassName("edit");
        for(var i = 0; i < edits.length; i++) {
            edits[i].classList.add("hidden-element");
        } 
    }
}

function test()
{
    console.warn("chuj");
}

class Produkt {
  constructor(id, nazwa, model, rokProdukcji, cena, zuzycieEnergii) {
      this.id = id;
      this.nazwa = nazwa;
      this.model = model;
      this.rokProdukcji = rokProdukcji;
      this.cena = cena;
      this.zuzycieEnergii = zuzycieEnergii;
  }

  koszt() {
      return this.cena;
  }

  kosztEnergii(cenaEnergii) {
      return this.zuzycieEnergii * cenaEnergii;
  }

  wiekProduktu() {
      const dzis = new Date();
      return dzis.getFullYear() - this.rokProdukcji;
  }

  wiekProduktuLata() {
      const wiek = this.wiekProduktu();
      if (wiek === 1) return `${wiek} rok`;
      else if (wiek >= 2 && wiek <= 4) return `${wiek} lata`;
      else return `${wiek} lat`;
  }
}

class ListaTowarów {
  constructor() {
      this.produkty = [];
  }

  opisProduktu(idProduktu) {
      const produkt = this.produkty.find(p => p.id === idProduktu);
      if (!produkt) {
          throw new Error('Produkt nie został znaleziony.');
      }
      return `ID: ${produkt.id}, Nazwa: ${produkt.nazwa}, Model: ${produkt.model}, Rok Produkcji: ${produkt.rokProdukcji}, Cena: ${produkt.cena} PLN, Zużycie Energii: ${produkt.zuzycieEnergii} kWh`;
  }

  opisWszystkichProduktów() {
      return this.produkty.map(p => this.opisProduktu(p.id)).join('\n');
  }

  dodajProdukt(produkt) {
      if (this.produkty.some(p => p.id === produkt.id)) {
          throw new Error('Produkt o tym ID już istnieje.');
      }
      this.produkty.push(produkt);
  }

  zmieńProdukt(idProduktu, nowyProdukt) {
      const produkt = this.produkty.find(p => p.id === idProduktu);
      if (!produkt) {
          throw new Error('Produkt nie został znaleziony.');
      }
      produkt.nazwa = nowyProdukt.nazwa;
      produkt.model = nowyProdukt.model;
      produkt.rokProdukcji = nowyProdukt.rokProdukcji;
      produkt.cena = nowyProdukt.cena;
      produkt.zuzycieEnergii = nowyProdukt.zuzycieEnergii;
  }
}

class Magazyn extends ListaTowarów {
  constructor() {
      super();
      this.stanMagazynowy = {};
  }

  dodajProdukt(produkt, ilosc) {
      super.dodajProdukt(produkt);
      this.stanMagazynowy[produkt.id] = ilosc;
  }

  zabierzProdukt(idProduktu, ilosc) {
      if (!this.stanMagazynowy[idProduktu] || this.stanMagazynowy[idProduktu] < ilosc) {
          throw new Error('Niewystarczający stan magazynowy.');
      }
      this.stanMagazynowy[idProduktu] -= ilosc;
      return { ...this.produkty.find(p => p.id === idProduktu) };
  }

  znajdzProdukt(nazwa, model) {
      return this.produkty.find(p => p.nazwa === nazwa && p.model === model);
  }
}


class Sklep extends ListaTowarów {
  constructor() {
      super();
      this.licznikID = 1;
  }

  dodajProdukt(nazwa, model, cena, zuzycieEnergii) {
      const id = this.licznikID++;
      const rok = new Date().getFullYear();
      const nowyProdukt = new Produkt(id, nazwa, model, rok, cena, zuzycieEnergii);
      super.dodajProdukt(nowyProdukt);
  }

  dodajProduktZId(idProduktu, nazwa, model, cena, zuzycieEnergii) {
      const rok = new Date().getFullYear();
      const nowyProdukt = new Produkt(idProduktu, nazwa, model, rok, cena, zuzycieEnergii);
      super.dodajProdukt(nowyProdukt);
  }

  zlozZamowienie(magazyn, produktyDoZamowienia) {
      produktyDoZamowienia.forEach(({idProduktu, ilosc}) => {
          magazyn.zabierzProdukt(idProduktu, ilosc);
      });
  }
}





// Tworzymy magazyn i sklep
const magazyn = new Magazyn();
const sklep = new Sklep();

// Dodajemy produkt do magazynu
const produkt1 = new Produkt(1, "Lodówka", "Samsung", 2020, 1500, 300);
magazyn.dodajProdukt(produkt1, 10);

// Dodajemy produkt do sklepu
sklep.dodajProdukt("Pralka", "LG", 2000, 500);

// Składamy zamówienie
sklep.zlozZamowienie(magazyn, [{idProduktu: 1, ilosc: 2}]);

// Opis wszystkich produktów
console.log(sklep.opisWszystkichProduktów());
console.log(magazyn.opisWszystkichProduktów());