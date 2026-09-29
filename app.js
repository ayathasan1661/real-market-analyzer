const chartEl = document.getElementById('chart');
const statusEl = document.getElementById('status');
const buyerEl = document.getElementById('buyer');
const sellerEl = document.getElementById('seller');

const chart = LightweightCharts.createChart(chartEl, {
  layout: {
    background: { color: '#0b1020' },
    textColor: '#b9c3da'
  },

  grid: {
    vertLines: { color: '#182039' },
    horzLines: { color: '#182039' }
  },

  rightPriceScale: {
    borderColor: '#28324a'
  },

  timeScale: {
    borderColor: '#28324a',
    timeVisible: true,
    secondsVisible: false
  }
});


const candles = chart.addCandlestickSeries({
  upColor: '#16c784',
  downColor: '#ea3943',
  borderUpColor: '#16c784',
  borderDownColor: '#ea3943',
  wickUpColor: '#16c784',
  wickDownColor: '#ea3943'
});


const supportSeries = chart.addLineSeries({
  color: '#22c55e',
  lineWidth: 1,
  lineStyle: 2,
  title: 'Support'
});


const resistanceSeries = chart.addLineSeries({
  color: '#ef4444',
  lineWidth: 1,
  lineStyle: 2,
  title: 'Resistance'
});


let timeframe = '15min';


function makeDemoData(count = 180) {

  const data = [];

  let price = 1.0850;

  const now = Math.floor(Date.now() / 1000);

  const step =
    timeframe === '1min' ? 60 :
    timeframe === '5min' ? 300 :
    timeframe === '15min' ? 900 :
    timeframe === '1h' ? 3600 :
    14400;


  for (let i = count; i > 0; i--) {

    const time = now - i * step;

    const open = price;

    const move = (Math.random() - 0.48) * 0.004;

    const close = Math.max(0.5, open + move);

    const high =
      Math.max(open, close) +
      Math.random() * 0.0015;

    const low =
      Math.min(open, close) -
      Math.random() * 0.0015;


    data.push({
      time,
      open,
      high,
      low,
      close
    });


    price = close;
  }


  return data;
}


function analyze(data) {

  const recent = data.slice(-60);

  const lows = recent.map(x => x.low);

  const highs = recent.map(x => x.high);


  const support = Math.min(...lows);

  const resistance = Math.max(...highs);


  supportSeries.setData(
    data.map(x => ({
      time: x.time,
      value: support
    }))
  );


  resistanceSeries.setData(
    data.map(x => ({
      time: x.time,
      value: resistance
    }))
  );


  const last = data[data.length - 1];

  const range =
    Math.max(last.high - last.low, 0.00000001);


  const buyer =
    Math.max(
      0,
      Math.min(
        100,
        ((last.close - last.low) / range) * 100
      )
    );


  const seller = 100 - buyer;


  buyerEl.textContent =
    buyer.toFixed(0) + '%';

  sellerEl.textContent =
    seller.toFixed(0) + '%';
}


function loadChart() {

  const data = makeDemoData();


  candles.setData(data);


  analyze(data);


  chart.timeScale().fitContent();


  const symbol =
    document.getElementById('symbol').value;


  statusEl.textContent =
    symbol +
    ' — Demo market data active. Real market API will be connected next.';
}


document
  .querySelectorAll('[data-tf]')
  .forEach(button => {

    button.addEventListener('click', () => {

      document
        .querySelectorAll('[data-tf]')
        .forEach(btn =>
          btn.classList.remove('active')
        );


      button.classList.add('active');


      timeframe = button.dataset.tf;


      loadChart();
    });

  });


document
  .getElementById('symbol')
  .addEventListener('change', () => {

    loadChart();

  });


document
  .querySelector('[data-tf="15min"]')
  .classList.add('active');


loadChart();


window.addEventListener('resize', () => {

  chart.applyOptions({
    width: chartEl.clientWidth
  });

});
