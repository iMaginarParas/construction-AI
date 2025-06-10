import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Trophy, Calendar, BarChart3, Users, Star, Clock, Target, Shield, CheckCircle, Home, Wallet, Award, ChevronRight, Play, ArrowLeft } from 'lucide-react';

const TradeUp50Demo = () => {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [gameMode, setGameMode] = useState('');
  const [selectedStocks, setSelectedStocks] = useState({ up: [], down: [] });
  const [currentContest, setCurrentContest] = useState('daily');
  const [userBalance, setUserBalance] = useState(5000);

  // Mock data
  const stockData = {
    indian: [
      { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2845.50, change: 2.3, volume: '12.5M' },
      { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3724.80, change: -1.2, volume: '8.2M' },
      { symbol: 'INFY', name: 'Infosys Limited', price: 1456.75, change: 3.1, volume: '15.8M' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1678.90, change: 0.8, volume: '22.1M' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1089.65, change: -0.5, volume: '18.7M' },
      { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1234.20, change: 1.9, volume: '9.3M' },
      { symbol: 'ITC', name: 'ITC Limited', price: 456.85, change: -2.1, volume: '45.2M' },
      { symbol: 'SBIN', name: 'State Bank of India', price: 623.40, change: 2.7, volume: '67.8M' },
      { symbol: 'LT', name: 'Larsen & Toubro', price: 3456.75, change: 1.4, volume: '5.9M' },
      { symbol: 'HCLTECH', name: 'HCL Technologies', price: 1789.30, change: -0.8, volume: '11.2M' }
    ],
    us: [
      { symbol: 'AAPL', name: 'Apple Inc.', price: 189.25, change: 1.8, volume: '89.2M' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', price: 378.90, change: -0.4, volume: '45.6M' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 145.67, change: 2.1, volume: '67.3M' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 156.89, change: -1.6, volume: '78.9M' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 234.56, change: 4.2, volume: '156.7M' },
      { symbol: 'META', name: 'Meta Platforms', price: 345.78, change: -2.3, volume: '89.4M' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 567.89, change: 3.7, volume: '234.5M' },
      { symbol: 'NFLX', name: 'Netflix Inc.', price: 456.23, change: 0.9, volume: '34.2M' },
      { symbol: 'AMD', name: 'Advanced Micro Devices', price: 123.45, change: -1.1, volume: '123.6M' },
      { symbol: 'INTC', name: 'Intel Corporation', price: 67.89, change: 2.4, volume: '98.7M' }
    ],
    crypto: [
      { symbol: 'BTC', name: 'Bitcoin', price: 67890.50, change: 3.2, volume: '$45.6B' },
      { symbol: 'ETH', name: 'Ethereum', price: 3456.78, change: -1.8, volume: '$23.4B' },
      { symbol: 'BNB', name: 'Binance Coin', price: 567.89, change: 2.1, volume: '$12.3B' },
      { symbol: 'ADA', name: 'Cardano', price: 0.89, change: 4.5, volume: '$8.9B' },
      { symbol: 'SOL', name: 'Solana', price: 123.45, change: -2.7, volume: '$6.7B' },
      { symbol: 'DOT', name: 'Polkadot', price: 12.34, change: 1.6, volume: '$4.5B' },
      { symbol: 'AVAX', name: 'Avalanche', price: 45.67, change: -0.9, volume: '$3.2B' },
      { symbol: 'LINK', name: 'Chainlink', price: 23.45, change: 3.8, volume: '$2.8B' },
      { symbol: 'UNI', name: 'Uniswap', price: 8.90, change: -1.4, volume: '$1.9B' },
      { symbol: 'MATIC', name: 'Polygon', price: 1.23, change: 5.2, volume: '$1.5B' }
    ]
  };

  const contests = [
    { id: 'daily', name: 'Daily Contest', entry: 10, prize: 1000, participants: 2547, duration: '24h', endTime: '14h 23m' },
    { id: 'weekly', name: 'Weekly Contest', entry: 50, prize: 10000, participants: 8923, duration: '7d', endTime: '4d 18h' },
    { id: 'monthly', name: 'Monthly Contest', entry: 200, prize: 100000, participants: 15643, duration: '30d', endTime: '12d 6h' }
  ];

  const leaderboard = [
    { rank: 1, name: 'Rajesh Kumar', points: '+28.4%', winnings: '₹5,670' },
    { rank: 2, name: 'Priya Sharma', points: '+24.1%', winnings: '₹4,230' },
    { rank: 3, name: 'Amit Patel', points: '+19.8%', winnings: '₹3,180' },
    { rank: 4, name: 'You', points: '+12.4%', winnings: '₹1,250' },
    { rank: 5, name: 'Neha Singh', points: '+8.7%', winnings: '₹890' }
  ];

  const handleStockSelection = (stock, direction) => {
    const maxUp = gameMode === 'buy' ? 7 : 3;
    const maxDown = gameMode === 'buy' ? 3 : 7;
    
    setSelectedStocks(prev => {
      const newSelected = { ...prev };
      
      if (direction === 'up') {
        if (newSelected.up.includes(stock.symbol)) {
          newSelected.up = newSelected.up.filter(s => s !== stock.symbol);
        } else if (newSelected.up.length < maxUp) {
          newSelected.up.push(stock.symbol);
        }
      } else {
        if (newSelected.down.includes(stock.symbol)) {
          newSelected.down = newSelected.down.filter(s => s !== stock.symbol);
        } else if (newSelected.down.length < maxDown) {
          newSelected.down.push(stock.symbol);
        }
      }
      
      return newSelected;
    });
  };

  const StockCard = ({ stock, market }) => (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-gray-900">{stock.symbol}</h3>
          <p className="text-sm text-gray-600 truncate">{stock.name}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg">
            {market === 'crypto' ? '$' : market === 'us' ? '$' : '₹'}{stock.price.toLocaleString()}
          </p>
          <p className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stock.change >= 0 ? '+' : ''}{stock.change}%
          </p>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
        <span>Vol: {stock.volume}</span>
        <div className="flex items-center">
          {stock.change >= 0 ? 
            <TrendingUp className="w-3 h-3 text-green-600 mr-1" /> : 
            <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
          }
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => handleStockSelection(stock, 'up')}
          className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
            selectedStocks.up.includes(stock.symbol)
              ? 'bg-green-600 text-white'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
          disabled={!selectedStocks.up.includes(stock.symbol) && 
                   selectedStocks.up.length >= (gameMode === 'buy' ? 7 : 3)}
        >
          <TrendingUp className="w-4 h-4 mx-auto" />
        </button>
        <button
          onClick={() => handleStockSelection(stock, 'down')}
          className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
            selectedStocks.down.includes(stock.symbol)
              ? 'bg-red-600 text-white'
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
          disabled={!selectedStocks.down.includes(stock.symbol) && 
                   selectedStocks.down.length >= (gameMode === 'buy' ? 3 : 7)}
        >
          <TrendingDown className="w-4 h-4 mx-auto" />
        </button>
      </div>
    </div>
  );

  // 1. Main Dashboard Screen
  const DashboardScreen = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, Trader!</h2>
            <p className="opacity-90">Ready to make your next winning move?</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Today's Market</p>
            <p className="text-xl font-bold">+2.4% ▲</p>
          </div>
        </div>
      </div>

      {/* Wallet Balance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Wallet Balance</h3>
              <p className="text-sm text-gray-600">Available to play</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">₹{userBalance.toLocaleString()}</p>
            <button className="text-blue-600 text-sm hover:underline">Add Money</button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">₹2,340</p>
            <p className="text-xs text-gray-600">Total Winnings</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-blue-600">8</p>
            <p className="text-xs text-gray-600">Contests Won</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-purple-600">66.7%</p>
            <p className="text-xs text-gray-600">Win Rate</p>
          </div>
        </div>
      </div>

      {/* Ongoing Contests */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Live Contests</h3>
          <button 
            onClick={() => setCurrentScreen('marketSelection')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Join Contest</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {contests.map(contest => (
            <div key={contest.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{contest.name}</h4>
                  <p className="text-sm text-gray-600">Entry: ₹{contest.entry} • Prize: ₹{contest.prize.toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{contest.endTime} left</p>
                <p className="text-xs text-gray-600">{contest.participants.toLocaleString()} players</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Highlights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Daily Leaderboard</h3>
          <Award className="w-5 h-5 text-yellow-600" />
        </div>
        
        <div className="space-y-3">
          {leaderboard.map((player, index) => (
            <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
              player.name === 'You' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  player.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                  player.rank === 2 ? 'bg-gray-100 text-gray-800' :
                  player.rank === 3 ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {player.rank}
                </div>
                <div>
                  <p className={`font-medium ${player.name === 'You' ? 'text-blue-900' : 'text-gray-900'}`}>
                    {player.name}
                  </p>
                  <p className="text-sm text-gray-600">{player.points}</p>
                </div>
              </div>
              <p className="font-medium text-green-600">{player.winnings}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 2. Market Selection Screen
  const MarketSelectionScreen = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setCurrentScreen('dashboard')}
          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Choose Your Market</h2>
          <p className="text-gray-600">Select the market you want to trade in</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={() => {
            setSelectedMarket('indian');
            setCurrentScreen('modeSelection');
          }}
          className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-400 transition-colors group text-left"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-4xl">🇮🇳</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Indian Stocks</h3>
              <p className="text-gray-600">NSE & BSE Listed Companies</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Top Gainers:</span>
              <span className="text-green-600 font-medium">RELIANCE +2.3%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Most Active:</span>
              <span className="text-blue-600 font-medium">TCS, INFY, HDFC</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-700">
            <span className="font-medium">Select Market</span>
            <ChevronRight className="w-4 h-4 ml-2" />
          </div>
        </button>

        <button
          onClick={() => {
            setSelectedMarket('us');
            setCurrentScreen('modeSelection');
          }}
          className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-400 transition-colors group text-left"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-4xl">🇺🇸</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">US Stocks</h3>
              <p className="text-gray-600">NYSE & NASDAQ Listed</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Top Gainers:</span>
              <span className="text-green-600 font-medium">TSLA +4.2%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Most Active:</span>
              <span className="text-blue-600 font-medium">AAPL, MSFT, NVDA</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-700">
            <span className="font-medium">Select Market</span>
            <ChevronRight className="w-4 h-4 ml-2" />
          </div>
        </button>

        <button
          onClick={() => {
            setSelectedMarket('crypto');
            setCurrentScreen('modeSelection');
          }}
          className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-400 transition-colors group text-left"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-4xl">₿</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Cryptocurrency</h3>
              <p className="text-gray-600">Digital Assets & Tokens</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Top Gainers:</span>
              <span className="text-green-600 font-medium">MATIC +5.2%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Most Active:</span>
              <span className="text-blue-600 font-medium">BTC, ETH, BNB</span>
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-700">
            <span className="font-medium">Select Market</span>
            <ChevronRight className="w-4 h-4 ml-2" />
          </div>
        </button>
      </div>

      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">1</div>
            <p>Choose your preferred market to trade in</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">2</div>
            <p>Select BUY or SELL trading strategy</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">3</div>
            <p>Pick your stocks and join the contest</p>
          </div>
        </div>
      </div>
    </div>
  );

  // 3. Mode Selection Screen
  const ModeSelectionScreen = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setCurrentScreen('marketSelection')}
          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Choose Trading Strategy</h2>
          <p className="text-gray-600">
            {selectedMarket === 'indian' ? '🇮🇳 Indian Stocks' : 
             selectedMarket === 'us' ? '🇺🇸 US Stocks' : 
             '₿ Cryptocurrency'} Market Selected
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <button
          onClick={() => {
            setGameMode('buy');
            setCurrentScreen('stockSelection');
          }}
          className="bg-white border-2 border-green-200 rounded-xl p-8 hover:border-green-400 transition-colors group"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
              <TrendingUp className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">BUY Strategy</h3>
            <p className="text-gray-600 mb-6">Bullish approach - expecting market to rise</p>
            
            <div className="space-y-3 text-left">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-sm font-medium text-green-800">✓ Pick 7 stocks you think will go UP</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-sm font-medium text-red-800">✓ Pick 3 stocks you think will go DOWN</p>
              </div>
            </div>
            
            <div className="mt-6 bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-800 font-medium">
                Win when your UP picks rise more than your DOWN picks fall
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            setGameMode('sell');
            setCurrentScreen('stockSelection');
          }}
          className="bg-white border-2 border-red-200 rounded-xl p-8 hover:border-red-400 transition-colors group"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-200 transition-colors">
              <TrendingDown className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">SELL Strategy</h3>
            <p className="text-gray-600 mb-6">Bearish approach - expecting market to fall</p>
            
            <div className="space-y-3 text-left">
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-sm font-medium text-red-800">✓ Pick 7 stocks you think will go DOWN</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-sm font-medium text-green-800">✓ Pick 3 stocks you think will go UP</p>
              </div>
            </div>
            
            <div className="mt-6 bg-red-50 rounded-lg p-4">
              <p className="text-sm text-red-800 font-medium">
                Win when your DOWN picks fall more than your UP picks rise
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Strategy Tips</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-medium text-green-700 mb-2">BUY Strategy Best For:</h4>
            <ul className="space-y-1">
              <li>• Bull market conditions</li>
              <li>• Positive market sentiment</li>
              <li>• Strong earnings season</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-red-700 mb-2">SELL Strategy Best For:</h4>
            <ul className="space-y-1">
              <li>• Bear market conditions</li>
              <li>• Market uncertainty</li>
              <li>• Economic downturns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // 4. Stock Selection Screen
  const StockSelectionScreen = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setCurrentScreen('modeSelection')}
          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {gameMode === 'buy' ? 'BUY Strategy' : 'SELL Strategy'} - Stock Selection
          </h2>
          <p className="text-gray-600">
            {selectedMarket === 'indian' ? '🇮🇳 Indian Stocks' : 
             selectedMarket === 'us' ? '🇺🇸 US Stocks' : 
             '₿ Cryptocurrency'} • {gameMode === 'buy' ? '7 UP + 3 DOWN' : '7 DOWN + 3 UP'}
          </p>
        </div>
      </div>

      {/* Selection Progress */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">
              Stocks Going UP ({selectedStocks.up.length}/{gameMode === 'buy' ? 7 : 3})
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedStocks.up.map(symbol => (
                <span key={symbol} className="bg-green-200 text-green-800 px-2 py-1 rounded text-sm">
                  {symbol}
                </span>
              ))}
              {Array.from({ length: (gameMode === 'buy' ? 7 : 3) - selectedStocks.up.length }).map((_, i) => (
                <span key={i} className="bg-gray-200 text-gray-500 px-2 py-1 rounded text-sm">
                  Empty
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">
              Stocks Going DOWN ({selectedStocks.down.length}/{gameMode === 'buy' ? 3 : 7})
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedStocks.down.map(symbol => (
                <span key={symbol} className="bg-red-200 text-red-800 px-2 py-1 rounded text-sm">
                  {symbol}
                </span>
              ))}
              {Array.from({ length: (gameMode === 'buy' ? 3 : 7) - selectedStocks.down.length }).map((_, i) => (
                <span key={i} className="bg-gray-200 text-gray-500 px-2 py-1 rounded text-sm">
                  Empty
                </span>
              ))}
            </div>
          </div>
        </div>

        {selectedStocks.up.length === (gameMode === 'buy' ? 7 : 3) && 
         selectedStocks.down.length === (gameMode === 'buy' ? 3 : 7) && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-blue-800">Ready to Join Contest!</h4>
                <p className="text-blue-700">All stocks selected. Entry fee: ₹{contests.find(c => c.id === currentContest)?.entry}</p>
              </div>
              <button 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                onClick={() => {
                  alert(`Contest entry confirmed! Good luck with your ${gameMode.toUpperCase()} strategy!`);
                  setUserBalance(prev => prev - contests.find(c => c.id === currentContest)?.entry);
                  setCurrentScreen('dashboard');
                }}
              >
                Join Contest
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stock Grid */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">
          Available {selectedMarket === 'indian' ? 'Indian Stocks' : 
                    selectedMarket === 'us' ? 'US Stocks' : 
                    'Cryptocurrencies'}
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stockData[selectedMarket].map(stock => (
            <StockCard 
              key={stock.symbol} 
              stock={stock} 
              market={selectedMarket} 
            />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 rounded-lg p-6">
        <h3 className="font-semibold text-yellow-800 mb-3">How to Select Stocks</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-yellow-700">
          <div className="space-y-2">
            <p className="font-medium">Click the buttons below each stock:</p>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <span>Select for UP movement</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-red-600" />
              </div>
              <span>Select for DOWN movement</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Your {gameMode.toUpperCase()} Strategy requires:</p>
            <p>• {gameMode === 'buy' ? '7' : '3'} stocks expected to go UP</p>
            <p>• {gameMode === 'buy' ? '3' : '7'} stocks expected to go DOWN</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TradeUp50
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800">₹{userBalance.toLocaleString()}</span>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">U</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Breadcrumb */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button 
              onClick={() => setCurrentScreen('dashboard')}
              className={`hover:text-blue-600 ${currentScreen === 'dashboard' ? 'text-blue-600 font-medium' : ''}`}
            >
              <Home className="w-4 h-4 inline mr-1" />
              Dashboard
            </button>
            
            {currentScreen !== 'dashboard' && (
              <>
                <span>/</span>
                <button 
                  onClick={() => setCurrentScreen('marketSelection')}
                  className={`hover:text-blue-600 ${currentScreen === 'marketSelection' ? 'text-blue-600 font-medium' : ''}`}
                >
                  Market Selection
                </button>
              </>
            )}
            
            {(currentScreen === 'modeSelection' || currentScreen === 'stockSelection') && (
              <>
                <span>/</span>
                <button 
                  onClick={() => setCurrentScreen('modeSelection')}
                  className={`hover:text-blue-600 ${currentScreen === 'modeSelection' ? 'text-blue-600 font-medium' : ''}`}
                >
                  Strategy Selection
                </button>
              </>
            )}
            
            {currentScreen === 'stockSelection' && (
              <>
                <span>/</span>
                <span className="text-blue-600 font-medium">Stock Selection</span>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentScreen === 'dashboard' && <DashboardScreen />}
        {currentScreen === 'marketSelection' && <MarketSelectionScreen />}
        {currentScreen === 'modeSelection' && <ModeSelectionScreen />}
        {currentScreen === 'stockSelection' && <StockSelectionScreen />}
      </main>


    </div>
  );
};

export default TradeUp50Demo;