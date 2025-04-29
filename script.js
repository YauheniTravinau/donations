// Кошельки и QR-коды (замени на свои изображения и адреса)
const wallets = {
  btc: {
    address: '1345acNhrMHe1fGK5aUamqY3u4xcuPFxaK',
    qr: 'photo/BTC_cr.jpg',
    logo: 'photo/BTC_bitcoin.png',
    name: 'Bitcoin (BTC)'
  },
  eth: {
    address: '0x784Ea834014370Cf06221E89735B10737C50dFbC',
    qr: 'photo/ETH_cr.jpg',
    logo: 'photo/eth-Ethereum.png',
    name: 'Ethereum (ETH)'
  },
  xrp: {
    address: 'rhvqMrbeD5CzNe9dX8Vt6ExpEfvbWkwngY',
    qr: 'photo/XRP_cr.jpg',
    logo: 'photo/xrp-ripple.png',
    name: 'XRP (Ripple)'
  },
  sol: {
    address: 'GNMWkGdxr6yvLPuuCt646pvdd6e1qvdDriMVBExmpmh9',
    qr: 'photo/SOL_cr.jpg',
    logo: 'photo/sol-solana.png',
    name: 'Solana (SOL)'
  },
  usdt: {
    logo: 'photo/usdt-tether.png',
    name: 'Tether (USDT)',
    networks: {
      TRC20: {
        address: 'TPmNY5TizJQqeayzvNzAsMUohKUdS6W9y8',
        qr: 'photo/USDT_cr.jpg',
        netName: 'TRC20'
      },
      BEP20: {
        address: '0x784Ea834014370Cf06221E89735B10737C50dFbC',
        qr: 'photo/USDT(bep20)_cr.jpg',
        netName: 'BEP20 | BNB'
      },
      ARBITRUM: {
        address: '0x784Ea834014370Cf06221E89735B10737C50dFbC',
        qr: 'photo/usdt-arbitrum_cr.jpg',
        netName: 'Arbitrum'
      }
    }
  },
  usdc: {
    logo: 'photo/usdc-usd-coin.png',
    name: 'USD Coin (USDC)',
    networks: {
      BEP20: {
        address: '0x784Ea834014370Cf06221E89735B10737C50dFbC',
        qr: 'photo/USDC(BEP20)_cr.jpg',
        netName: 'BEP20 | BNB'
      },
      ARBITRUM: {
        address: '0x784Ea834014370Cf06221E89735B10737C50dFbC',
        qr: 'photo/USDC(Arbitrum)_cr.jpg',
        netName: 'Arbitrum'
      }
    }
  },
  ton: {
    address: 'UQC9bcDEPQi5gdHFGwtWX8Yg-022ZxO_NejoW-GPfWQm6WBE',
    qr: 'photo/ton_cr.jpg',
    logo: 'photo/ton-toncoin.png',
    name: 'TON (Toncoin)'
  },
  tron: {
    address: 'TPmNY5TizJQqeayzvNzAsMUohKUdS6W9y8',
    qr: 'photo/TRX_cr.jpg',
    logo: 'photo/trx-tron.png',
    name: 'TRON (TRX)'
  },
};

const donateList = document.querySelector('.donate-list');

function renderButtons() {
  donateList.innerHTML = '';
  const allowed = ['btc', 'eth', 'xrp', 'sol', 'usdt', 'usdc', 'ton', 'tron'];
  allowed.forEach(key => {
    if (!wallets[key]) return;
    const btnWrap = document.createElement('div');
    btnWrap.className = 'donate-btn-wrap';
    const btn = document.createElement('button');
    btn.className = 'donate-btn';
    btn.setAttribute('data-crypto', key);
    btn.innerHTML = `<img class=\"crypto-logo\" src=\"${wallets[key].logo}\" alt=\"${key}\" />${wallets[key].name}`;
    btn.addEventListener('click', () => togglePopup(key, btnWrap));
    btnWrap.appendChild(btn);
    // popup контейнер
    const popup = document.createElement('div');
    popup.className = 'crypto-popup';
    popup.setAttribute('data-popup', key);
    btnWrap.appendChild(popup);
    donateList.appendChild(btnWrap);
  });
}

function togglePopup(crypto, wrap) {
  // Скрыть все попапы кроме текущего
  document.querySelectorAll('.crypto-popup').forEach(p => {
    if (p !== wrap.querySelector('.crypto-popup')) p.classList.remove('active');
  });
  // Закрыть, если открыт
  const popup = wrap.querySelector('.crypto-popup');
  if (popup.classList.contains('active')) {
    popup.classList.remove('active');
    popup.innerHTML = '';
    return;
  }
  document.querySelectorAll('.crypto-popup').forEach(p => {p.classList.remove('active'); p.innerHTML = '';});
  // Открыть и отрисовать
  popup.classList.add('active');
  renderPopupContent(crypto, popup);
}

function renderPopupContent(crypto, popup) {
  popup.innerHTML = '';
  // Для мультисетевых криптовалют — select
  if (wallets[crypto].networks) {
    const select = document.createElement('select');
    select.className = 'usdt-network-select';
    Object.keys(wallets[crypto].networks).forEach(net => {
      const option = document.createElement('option');
      option.value = net;
      option.textContent = wallets[crypto].networks[net].netName;
      select.appendChild(option);
    });
    popup.appendChild(select);
    // Контейнер для QR и адреса
    const qrImg = document.createElement('img');
    qrImg.className = 'qr-img';
    const addressDiv = document.createElement('div');
    addressDiv.className = 'wallet-address';
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'Скопировать адрес';
    const thanks = document.createElement('div');
    thanks.className = 'thanks';
    thanks.style.display = 'none';
    popup.appendChild(qrImg);
    popup.appendChild(addressDiv);
    popup.appendChild(copyBtn);
    popup.appendChild(thanks);
    // Функция отображения по сети
    function updateNetwork(netKey) {
      const net = wallets[crypto].networks[netKey];
      qrImg.src = net.qr;
      addressDiv.textContent = net.address;
      thanks.style.display = 'none';
    }
    select.addEventListener('change', () => {
      updateNetwork(select.value);
    });
    updateNetwork(Object.keys(wallets[crypto].networks)[0]);
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(addressDiv.textContent).then(() => {
        thanks.textContent = 'Спасибо!';
        thanks.style.display = 'block';
        setTimeout(() => { thanks.style.display = 'none'; }, 1400);
      });
    });
  } else {
    // Обычные монеты
    const qrImg = document.createElement('img');
    qrImg.className = 'qr-img';
    qrImg.src = wallets[crypto].qr;
    popup.appendChild(qrImg);
    const addressDiv = document.createElement('div');
    addressDiv.className = 'wallet-address';
    addressDiv.textContent = wallets[crypto].address;
    popup.appendChild(addressDiv);
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'Скопировать адрес';
    popup.appendChild(copyBtn);
    const thanks = document.createElement('div');
    thanks.className = 'thanks';
    thanks.style.display = 'none';
    popup.appendChild(thanks);
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(wallets[crypto].address).then(() => {
        thanks.textContent = 'Спасибо!';
        thanks.style.display = 'block';
        setTimeout(() => { thanks.style.display = 'none'; }, 1400);
      });
    });
  }
}

// --- БЛОК ПОДАРКОВ БЛАГОДАРНОСТИ ---
const jokes = [
  '— Поставь мне что-то весёлое! — Ставлю пятёрку.',
  'Интуиция — это когда уже всё понятно, а логика ещё ищет доказательства.',
  'У меня две скорости: "могу" и "не хочу".',
  '— Как ты отдыхаешь? — Лежу. Иногда меняю диван.',
  'Главное — вовремя притвориться мебелью, и тебя никто не попросит о помощи.',
  'Мой организм требует спорта. А мозг напоминает: "Ты легко поднимаешь настроение — этого достаточно".',
  'Вчера был день борьбы с прокрастинацией... я праздную завтра.',
  'Если хочешь удивить Вселенную — выспись.',
  'Не обязательно работать головой. Иногда достаточно включить обаяние!',
  'На работе как в сказке: чем дальше — тем страшнее.',
  // Новые анекдоты про любовь и семью:
  'Серьезные отношения — это когда молодой человек начинает выходить из квартиры девушки с мусорным ведром.',
  '— Батюшка, вчера моя жена исповедовалась вам, она мне не изменяет?\n— Это тайна исповеди, иди с миром, олень ты наш!',
  'Женщина в семье как переводчик: понимает и детский лепет, и пьяный бред.',
  'Хотел наладить отношения с тещей и решил заказать ей красивое платье. Как назло, она проснулась, когда я мерил длину рулеткой.',
  'Он:\n— Сделай бутерброд.\nОна сделала. Он съел:\n— А можно еще?\n— Нет. Это демоверсия заботливой жены. Лицензированную версию получите после официальной регистрации в ЗАГСе.',
  'Девушка рассказывает подругам:\n— Мужик у меня был настоящий зверь! Порода — сексуальный ленивец.',
  'В аптеке:\n— Что лучше для мужа — валидол или валерьянка?\n— А диагноз какой?\n— Туфли за 30 тысяч.',
  'Типичная ситуация: хочешь проверить, знает ли он, когда годовщина ваших отношений, а он и не знает, что он в них состоит.',
  // Короткие анекдоты:
  '— Ты бы хотел работать четыре дня в неделю? — Нет. — Почему? — Я и за понедельник страшно устаю.',
  '— Ты обиделась? — Нет. — Ты точно не обиделась? — Нет. — Тогда почему ты не отвечаешь? — Я занята. — Чем же? — Продумываю план мести.',
  '— Есть что-нибудь выпить? — Вода. — А покрепче? — Лед.',
  '— Сеня!? Так и что я вас за Москву хотел спросить… Скока там стоит снять квартиру? — Яша! Я вас умоляю! Снять квартиру там можно тока на фотоаппарат!',
  '— Мамочка, а ангелы летают? — Да, доченька, летают. — А наш папа, назвал соседку ангелом, когда она полетит? — Минут через 10…',
  '— Софочка, я прочитала, что для похудения надо уголь активированный пить? — Циля, чтобы похудеть, уголь надо не пить, а разгружать.',
  '— Святой отец, я согрешила… — Ну согрешила и согрешила. Что ходишь всем рассказываешь?',
  '— Пойди посмотри, чем там кошка на кухне гремит. — А ты ее кормила? — Нет. — Значит, готовит что-то.',
  '— А я эконом-классом никогда не летаю. — Молодец, летаешь первым или бизнес классом? — Нет, в плацкартном.',
  '— Что, ждешь принца на белом «Лексусе»? — Да нет… Главное, чтобы человек был хороший. А какого цвета «Лексус», неважно...'
];
const songs = [
  '🎵 "Всё идёт по плану..."',
  '🎵 "Пока-пока, работа! Привет, веселье!"',
  '🎵 "Не переживай, всё будет хорошо!"',
  '🎵 "Отпускаю и улыбаюсь..."',
  '🎵 "Если весело живётся — делай так!" *хлоп-хлоп*'
];
const quotes = [
  '"Когда ничего не помогает — остаётся пойти и съесть что-нибудь вкусное." — Винни-Пух.',
  '"Иногда самое продуктивное, что ты можешь сделать — это хорошо отдохнуть."',
  '"Делай добро, и оно обязательно вернётся к тебе... возможно, даже с пиццей!"',
  '"Если что-то идёт не так — добавь кофе и попробуй ещё раз."',
  '"Опыт — это слово, которым люди называют свои ошибки."'
];
const memes = [
  'Жизненный лайфхак: если надоело — просто сделай вид, что ты куст.',
  'Планы на день: 1. Проснуться. 2. Удивиться, что снова понедельник.',
  'Мотивация дня: «Я могу. Я должен. Или хотя бы полежу рядом».',
  'Сначала ты работаешь на заварку, потом заварка работает на тебя.',
  'Мозг ночью: "Пора спать!" — "А давай вспомним все свои неловкие моменты!".'
];
const thanks = [
  '"Огромное спасибо каждому, кто поддержал! Благодаря вам этот проект стал возможным."',
  '"Доброе слово и помощь, особенно в трудный момент, — бесценны. Спасибо за всё!"',
  '"Сила проекта — в людях, которые верили и помогали. Благодарим от души!"',
  '"Ваш вклад в этот проект — это не просто помощь, это частичка добра, которую мы сохраним навсегда."',
  '"Никто не может всё сделать в одиночку. Спасибо тем, кто протянул руку поддержки!"'
];
const bonus = [
  '"Позитив — это не когда всё идеально, а когда ты умеешь видеть хорошее даже в хаосе."',
  '"Кто рано встаёт… тот потом весь день зевает!"',
  '"Если руки опускаются — танцуй руками!"',
  '"Работа мечты — это когда не знаешь, работаешь ты или отдыхаешь."',
  '"Смешные идеи тоже двигают мир. Так что улыбайтесь чаще!"'
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function showGratitude(type) {
  let content = '';
  if (type === 'joke') content = getRandom(jokes);
  else if (type === 'meme') content = getRandom(memes);
  else if (type === 'song') content = getRandom(songs);
  else if (type === 'quote') content = getRandom(quotes);
  else if (type === 'thanks') content = getRandom(thanks);
  else if (type === 'bonus') content = getRandom(bonus);
  document.getElementById('gratitude-content').innerHTML = content;
  document.getElementById('gratitude-popup').classList.remove('hidden');
}
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.gift').forEach(gift => {
    gift.addEventListener('click', function() {
      gift.classList.add('active');
      setTimeout(() => gift.classList.remove('active'), 700);
      showGratitude(gift.dataset.type);
    });
  });
  document.getElementById('gratitude-close').onclick = function() {
    document.getElementById('gratitude-popup').classList.add('hidden');
  };
  document.getElementById('gratitude-popup').onclick = function(e) {
    if (e.target === this) this.classList.add('hidden');
  };
});

renderButtons();
