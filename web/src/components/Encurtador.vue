<template>
  <div class="encurtador">
    <h1>Encurtador de URL</h1>
    <div class="card">
      <legend for="url-input">Adicione a URL que você deseja encurtar:</legend>
      <input
        type="text"
        name="url-input"
        placeholder="Digite sua URL aqui"
        v-model="urlInput"
      />
      <button type="button" v-on:click="shortUrlRequest">Encurtar!</button>
      <div class="result">
        <p>{{ urlShort }}</p>
      </div>
      <footer>O link possui a validade de 1 dia.</footer>
    </div>
  </div>
</template>

<script>
import api from '../services/api'
import moment from 'moment'

export default {
  name: 'Encurtador',
  data() {
    return {
      urlInput: '',
      urlShort: ''
    }
  },
  methods: {
    async shortUrlRequest() {
      const date = moment().format('YYYY-MM-DD')
      const urlOrigin = this.urlInput

      console.log(date, urlOrigin)

      const { data } = await api.post('/shortener', {
        url_origin: urlOrigin,
        date
      })
      this.urlShort = data
    }
  }
}
</script>

<style scoped>
h1 {
  margin-bottom: 32px;
}
.card {
  background: #cef1e4;
  width: 80vw;
  max-width: 700px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  box-shadow: 3px 3px 5px -1px rgba(0, 0, 0, 0.5);
}

.card legend {
  font-size: 22px;
  margin-bottom: 32px;
}

.card input {
  width: 70%;
  height: 52px;
  border-radius: 9px;
  border: none;
  font: 400 18px 'Open Sans';
  padding: 0 14px;
  margin-bottom: 32px;
}

.card input:focus {
  border: 2px solid #2c3e50;
  box-shadow: 3px 3px 5px -1px rgba(0, 0, 0, 0.5);
}

.card button {
  width: 200px;
  height: 50px;
  background: #2c3e50;
  color: white;
  font: 400 18px 'Open Sans';
  border: 0;
  border-radius: 0.8rem;
  text-emphasis: none;
  cursor: pointer;
  transition: all 0.5s;
  transition-property: background-color, box-shadow;
  margin-bottom: 32px;
}

.card button:hover {
  background: #67a5a5;
  box-shadow: 3px 3px 5px -1px rgba(0, 0, 0, 0.5);
}

.result {
  width: 70%;
  height: 52px;
  border-radius: 9px;
  border: 2px solid #2c3e50;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result p {
  font: 700 18px 'Open Sans';
}
</style>
