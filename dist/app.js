// Configurando a conexão com o servidor via Socket.io
const socket = io('/');

// Definindo um componente Vue para votação
Vue.component('voting-component', {
  props: ['roomId'],
  data: function() {
    return {
      votes: [],
      hasVoted: false,
      vote: '',
      totalUsers: 0,
      votesCount: 0,
      maxVotes: 0
    };
  },
  template: `
    <div>
      <h2>Vote aqui:</h2>
      <div v-if="!hasVoted">
        <input v-model="vote" placeholder="Digite seu voto" />
        <button @click="sendVote">Enviar Voto</button>
      </div>
      <div v-else>
        <h3>Você já votou. Aguarde os resultados.</h3>
      </div>
      <p>Total de pessoas na sala: {{ totalUsers }}</p>
      <p>Total de votos recebidos: {{ votesCount }}/{{ maxVotes }}</p>
      <h3>Votos recebidos:</h3>
      <ul>
        <li v-for="vote in votes">{{ vote }}</li>
      </ul>
    </div>
  `,
  methods: {
    sendVote() {
      if (this.vote) {
        socket.emit('send_vote', this.roomId, this.vote, (success) => {
          if (success) {
            this.hasVoted = true;
          } else {
            alert('Falha ao enviar o voto');
          }
        });
      }
    }
  },
  mounted() {
    socket.on('voting_result', (votes) => {
      this.votes = votes;
    });

    socket.on('room_info', (info) => {
      this.totalUsers = info.totalUsers;
      this.votesCount = info.votesCount;
      this.maxVotes = info.maxVotes;
    });
  }
});

function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Criando a instância principal do Vue
new Vue({
  el: '#app',
  data: {
    roomId: null,
    maxVotes: 0,
  },
  methods: {
    createRoom() {
      console.log('Trying to create room');
      socket.emit('create_room', this.maxVotes, (roomId) => {
        console.log('Created room', roomId);
        this.roomId = roomId;
        window.history.pushState({}, '', `?id=${roomId}`);
      });
    },
    joinRoom() {
      if (this.enteredRoomId) {
          console.log('Trying to enter room', this.enteredRoomId);
          socket.emit('join_room', this.enteredRoomId, (success) => {
          if (success) {
            console.log('Joined room', this.enteredRoomId);
            this.roomId = this.enteredRoomId;
            this.joinError = null;
            window.history.pushState({}, '', `?id=${this.enteredRoomId}`);
          } else {
            console.log('Failed to join room', this.enteredRoomId);
            this.joinError = 'Falha ao entrar na sala. Verifique o ID da sala.';
            window.history.replaceState({}, '', '/');
          }
        });
      }
    }
  },
  mounted() {
    // Verifica se o ID da sala está na query string e tenta ingressar automaticamente
    const queryRoomId = getQueryParameter('id');
    if (queryRoomId) {
      this.enteredRoomId = queryRoomId;
      this.joinRoom();
    }
  }
});
