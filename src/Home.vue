<template>
  <div>
    <div class="ui fixed inverted menu">
      <div class="ui container">
        <a href="#" class="header item">
          <img class="logo" src="./assets/logo-mini.png">
          Bando Casa Emilia-Romagna
        </a>
        <div class="right item">
          <a class="ui inverted button" v-link="{ path: '/browser' }">Consulta alloggi <i class="right arrow icon"></i></a>
        </div>
      </div>
    </div>

    <div class="ui main text container">
      <h1 class="ui header">Il bando della Regione Emilia-Romagna <div class="ui blue tag label">2015</div></h1>
      <h2 class="ui header">Una casa alle giovani coppie ed altri nuclei familiari</h2>
      <p>La Regione Emilia Romagna aiuta le giovani coppie e altri nuclei familiari nell'acquisto della prima casa mettendo a disposizione un contributo di <b>25.000,00 euro</b> o <b>30.0000,00 euro</b><i  class="help circle icon moneyInfo" data-content="Per i soggetti residenti nei Comuni della Regione interessati dagli eventi sismici del 20 e 29 maggio 2012 che acquistano, anche con patto di futura vendita, un alloggio nell'ambito dello stesso Comune di residenza o in un comune ad esso contermine ricompreso nell'elenco dei Comuni terremotati" data-variation="very wide"></i> per alloggio.</p>
      <p>Gli alloggi disponibili si possono visualizzare nell'elenco pubblicato nel riquadro a lato "consultazione lista alloggi" sulla <a href="http://territorio.regione.emilia-romagna.it/bandi-di-gara/bando-giovani-coppie-e-altri-nuclei-familiari" target="_blank">pagina ufficiale del bando</a> oppure <a v-link="{ path: '/browser' }">nel nostro applicativo</a>.</p>
      <p>Per maggiori informazioni consultare la <a href="http://territorio.regione.emilia-romagna.it/bandi-di-gara/bando-giovani-coppie-e-altri-nuclei-familiari" target="_blank">pagina ufficiale del Bando giovani coppie</a> pubblicata dalla Regione per maggiori informazioni.
      </p>
      <h1 class="ui header">Visualizzazione alternativa degli alloggi</h1>
      <p>L'obiettivo di questo progetto è di offrire una visualizzazione interattiva per la ricerca degli alloggi interessati. Si tratta di un'applicazione web (accessibile <a v-link="{ path: '/browser' }">qui</a>) che mette a disposizione l'elenco degli alloggi pubblicato dalla Regione arricchito con la posizione geografica per ogni immobile.</p>
      <p>Per facilitare la ricerca e il confronto degli alloggi sono stati implementati diversi filtri, ordinamento e due modalità di visualizzazione: elenco o mappa.</p>
      <h3 class="ui header">Filtri</h3>
      Per facilitare la ricerca sono stati implementati i seguenti filtri:
      <div class="ui list">
        <div class="item">
          <i class="map icon"></i>
          <div class="content">
            <div class="header">Ubicazione</div>
            <div class="description">Per molti la posizione dell'immobile è il fattore più importante nella ricerca della casa. Per specificare l'area di interesse è possibile scegliere la/le provincia/e e la/le città di proprio interesse oppure disegnare un'area sulla mappa.</div>
          </div>
        </div>
        <div class="item">
          <i class="euro icon"></i>
          <div class="content">
            <div class="header">Prezzo</div>
            <div class="description">E' possibile scegliere un intervallo di valori desiderati sia per il prezzo complessivo che per il prezzo a metro quadro.</div>
          </div>
        </div>
        <div class="item">
          <i class="square outline icon"></i>
          <div class="content">
            <div class="header">Dimensione</div>
            <div class="description">E' possibile scegliere un intervallo di valori desiderati per il numero di locali e per la superficie complessiva dell'immobile.</div>
          </div>
        </div>
      </div>
      <h3 class="ui header">Elenco</h3>
      <img class="ui centered big bordered rounded image" src="./assets/listView.png">
      <h3 class="ui header">Mappa</h3>
      <img class="ui centered big bordered rounded image" src="./assets/mapView.jpg">
      <div class="ui basic center aligned segment">
        <div class="ui huge primary button" v-link="{ path: '/browser' }">Avvia la visualizzazione<i class="right arrow icon"></i></div>
      </div>
    </div>

    <div class="ui inverted vertical footer segment">
      <div class="ui container">
        <div class="ui stackable inverted divided equal height stackable grid">
          <div class="three wide column">
            <h4 class="ui inverted header">About</h4>
            <div class="ui inverted link list">
              <a href="#" class="item"></a>
            </div>
          </div>
          <div class="three wide column">
            <h4 class="ui inverted header"></h4>
            <div class="ui inverted link list">
              <a href="#" class="item"></a>
            </div>
          </div>
          <div class="seven wide column">
            <h4 class="ui inverted header"></h4>
            <p></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  data () {
    return {}
  },
  methods: {},
  ready: function () {
    $('.moneyInfo').popup()
  }
}
</script>

<style lang="less" scoped>
  .main.container {
    margin-top: 5em;
    margin-bottom: 4em;
  }
</style>