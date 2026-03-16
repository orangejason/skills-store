const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3004;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// ============ Skills 数据 ============

const skillsData = [
  // --- DeFi & Trading ---
  { id: 'okx-dex-swap', name: 'OKX DEX Swap', author: 'OKX', category: 'DeFi & Trading', icon: 'https://www.okx.com/cdn/assets/imgs/2112/A91FEF66E005CF47.png', description: '跨链代币兑换，聚合500+DEX流动性，智能路由最优价格。支持Solana、ETH、BSC、Base等20+链。', downloads: 128500, rating: 4.8, tags: ['swap', 'dex', 'cross-chain'], featured: true },
  { id: 'okx-dex-market', name: 'OKX DEX Market', author: 'OKX', category: 'DeFi & Trading', icon: 'https://www.okx.com/cdn/assets/imgs/2112/A91FEF66E005CF47.png', description: '实时链上代币价格、K线图、交易历史查询。支持多链价格监控和历史趋势分析。', downloads: 95200, rating: 4.7, tags: ['price', 'kline', 'market'], featured: true },
  { id: 'okx-dex-token', name: 'OKX DEX Token', author: 'OKX', category: 'DeFi & Trading', icon: 'https://www.okx.com/cdn/assets/imgs/2112/A91FEF66E005CF47.png', description: '代币搜索、热门代币排行、持有者分析、市值和流动性查询。', downloads: 87300, rating: 4.6, tags: ['token', 'trending', 'holders'] },
  { id: 'okx-wallet-portfolio', name: 'OKX Wallet Portfolio', author: 'OKX', category: 'DeFi & Trading', icon: 'https://www.okx.com/cdn/assets/imgs/2112/A91FEF66E005CF47.png', description: '查看钱包余额、代币持仓、投资组合价值，支持多链资产管理。', downloads: 72100, rating: 4.5, tags: ['wallet', 'portfolio', 'balance'] },
  { id: 'okx-onchain-gateway', name: 'OKX Onchain Gateway', author: 'OKX', category: 'DeFi & Trading', icon: 'https://www.okx.com/cdn/assets/imgs/2112/A91FEF66E005CF47.png', description: '链上交易广播、Gas估算、交易模拟和状态追踪。', downloads: 53800, rating: 4.4, tags: ['transaction', 'gas', 'broadcast'] },
  { id: 'xxyy-trade', name: 'XXYY Trade', author: 'XXYY', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/exchange.png', description: '链上代币交易，支持SOL/ETH/BSC/Base多链买卖、代币查询和安全检测。', downloads: 45600, rating: 4.3, tags: ['trade', 'multichain', 'security'] },
  { id: 'four-meme-ai', name: 'Four.meme AI', author: 'Four.meme', category: 'DeFi & Trading', icon: 'https://four.meme/favicon.ico', description: 'BSC链Meme代币创建和交易工具，支持一键发币、报价查询、税率分析。', downloads: 38900, rating: 4.5, tags: ['meme', 'bsc', 'launch'], featured: true },
  { id: 'uniswap-v3', name: 'Uniswap V3 Analytics', author: 'Uniswap Labs', category: 'DeFi & Trading', icon: 'https://app.uniswap.org/favicon.png', description: 'Uniswap V3池子分析、流动性管理、LP收益追踪。', downloads: 61200, rating: 4.6, tags: ['uniswap', 'lp', 'analytics'] },
  { id: 'jupiter-swap', name: 'Jupiter Aggregator', author: 'Jupiter', category: 'DeFi & Trading', icon: 'https://img.icons8.com/color/96/planet.png', description: 'Solana最大DEX聚合器，最优路由和限价单功能。', downloads: 55800, rating: 4.7, tags: ['solana', 'swap', 'aggregator'] },
  { id: 'raydium-pool', name: 'Raydium Pool Manager', author: 'Raydium', category: 'DeFi & Trading', icon: 'https://img.icons8.com/color/96/water.png', description: 'Raydium流动性池创建和管理，LP质押和收益追踪。', downloads: 32100, rating: 4.2, tags: ['raydium', 'solana', 'pool'] },
  { id: 'pancakeswap', name: 'PancakeSwap Helper', author: 'PancakeSwap', category: 'DeFi & Trading', icon: 'https://img.icons8.com/color/96/pancake.png', description: 'BSC链PancakeSwap交易辅助，农场收益计算和质押管理。', downloads: 29500, rating: 4.1, tags: ['bsc', 'farm', 'staking'] },
  { id: 'gmx-perp', name: 'GMX Perpetuals', author: 'GMX', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/combo-chart.png', description: '去中心化永续合约交易，支持多链杠杆交易和风险管理。', downloads: 27800, rating: 4.3, tags: ['perp', 'leverage', 'arbitrum'] },
  { id: '1inch-aggregator', name: '1inch DEX Aggregator', author: '1inch', category: 'DeFi & Trading', icon: 'https://img.icons8.com/color/96/unicorn.png', description: '多链DEX聚合器，Pathfinder算法实现最优交易路由，支持限价单和Fusion模式。', downloads: 48200, rating: 4.7, tags: ['aggregator', 'dex', 'routing'], featured: true },
  { id: 'paraswap-router', name: 'ParaSwap Router', author: 'ParaSwap', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/route.png', description: 'DEX聚合路由协议，MultiPath优化和Gas退款机制，支持EVM全链。', downloads: 31500, rating: 4.3, tags: ['aggregator', 'routing', 'gas-refund'] },
  { id: 'kyberswap-elastic', name: 'KyberSwap Elastic', author: 'Kyber Network', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/lightning-bolt.png', description: 'Elastic流动性协议，集中流动性管理和动态费率优化。', downloads: 22800, rating: 4.2, tags: ['liquidity', 'elastic', 'fee-optimization'] },
  { id: 'aave-lending', name: 'Aave Lending Manager', author: 'Aave', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/bank.png', description: 'Aave V3借贷协议管理，存款/借款利率监控、健康因子追踪和自动去杠杆。', downloads: 47300, rating: 4.7, tags: ['lending', 'borrowing', 'aave'], featured: true },
  { id: 'compound-finance', name: 'Compound Finance', author: 'Compound Labs', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/money-bag.png', description: 'Compound V3借贷市场，供应/借入管理、利率优化和清算保护。', downloads: 35600, rating: 4.4, tags: ['lending', 'compound', 'interest'] },
  { id: 'morpho-optimizer', name: 'Morpho Rate Optimizer', author: 'Morpho', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/positive-dynamic.png', description: 'Morpho借贷利率优化，P2P匹配引擎实现更优借贷利率。', downloads: 18900, rating: 4.3, tags: ['lending', 'optimization', 'p2p'] },
  { id: 'flash-loan-toolkit', name: 'Flash Loan Toolkit', author: 'FlashDAO', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/flash-on.png', description: '闪电贷开发工具包，支持Aave/dYdX/Balancer闪电贷构建、套利策略模板和利润计算。', downloads: 26400, rating: 4.1, tags: ['flash-loan', 'arbitrage', 'toolkit'] },
  { id: 'yearn-vaults', name: 'Yearn Vault Manager', author: 'Yearn Finance', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/safe.png', description: 'Yearn机枪池管理，自动化收益策略、APY追踪和资金池分析。', downloads: 33200, rating: 4.5, tags: ['yield', 'vault', 'auto-compound'] },
  { id: 'convex-staking', name: 'Convex Staking', author: 'Convex Finance', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/rocket.png', description: 'Convex质押和Curve LP增强收益，CRV/CVX奖励追踪和投票代理。', downloads: 21700, rating: 4.2, tags: ['staking', 'curve', 'boost'] },
  { id: 'pendle-yield', name: 'Pendle Yield Trading', author: 'Pendle', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/split-transaction.png', description: '收益代币化交易，将收益拆分为PT/YT进行投机或对冲，固定收益策略。', downloads: 28700, rating: 4.6, tags: ['yield-trading', 'tokenization', 'fixed-income'], featured: true },
  { id: 'eigenlayer-restake', name: 'EigenLayer Restaking', author: 'EigenLayer', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/refresh.png', description: 'ETH再质押协议管理，选择AVS运营商、委托质押和再质押收益追踪。', downloads: 42100, rating: 4.6, tags: ['restaking', 'eigenlayer', 'avs'], featured: true },
  { id: 'lido-staking', name: 'Lido Liquid Staking', author: 'Lido', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/droplet.png', description: 'Lido流动性质押，stETH铸造/赎回、质押APR监控和验证者分布分析。', downloads: 49800, rating: 4.7, tags: ['liquid-staking', 'steth', 'ethereum'] },
  { id: 'rocketpool-node', name: 'Rocket Pool Node', author: 'Rocket Pool', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/launched-rocket.png', description: 'Rocket Pool节点管理，minipool创建、rETH铸造和节点运营收益追踪。', downloads: 19500, rating: 4.3, tags: ['staking', 'node', 'reth'] },
  { id: 'dydx-perp-v4', name: 'dYdX V4 Perpetuals', author: 'dYdX', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/line-chart.png', description: 'dYdX V4永续合约交易，基于Cosmos的订单簿模式，高达50x杠杆和低延迟执行。', downloads: 38400, rating: 4.5, tags: ['perp', 'orderbook', 'cosmos'] },
  { id: 'hyperliquid-trade', name: 'Hyperliquid Trader', author: 'Hyperliquid', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/speed.png', description: 'Hyperliquid永续合约交易，L1原生订单簿、做市策略和Vault参与。', downloads: 44600, rating: 4.7, tags: ['perp', 'l1', 'orderbook'], featured: true },
  { id: 'synthetix-perps', name: 'Synthetix Perps', author: 'Synthetix', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/stocks.png', description: 'Synthetix永续合约交易，合成资产交易和sUSD抵押管理。', downloads: 23100, rating: 4.2, tags: ['perp', 'synthetic', 'snx'] },
  { id: 'vertex-protocol', name: 'Vertex Protocol', author: 'Vertex', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/triangle.png', description: 'Vertex DEX交易平台，现货+永续混合模式和跨保证金账户管理。', downloads: 19800, rating: 4.3, tags: ['perp', 'spot', 'cross-margin'] },
  { id: 'lyra-options', name: 'Lyra Options Trading', author: 'Lyra Finance', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/bullish.png', description: '链上期权交易协议，自动做市、Greek值分析和期权策略构建器。', downloads: 16200, rating: 4.1, tags: ['options', 'greeks', 'volatility'] },
  { id: 'opyn-squeeth', name: 'Opyn Squeeth', author: 'Opyn', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/parabola.png', description: 'Opyn平方ETH衍生品交易，永续期权和杠杆策略，无清算风险。', downloads: 14300, rating: 4.0, tags: ['options', 'squeeth', 'derivatives'] },
  { id: 'hegic-options', name: 'Hegic Options', author: 'Hegic', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/bearish.png', description: '链上期权协议，一键购买看涨/看跌期权，自动行权和流动性池挖矿。', downloads: 11800, rating: 3.9, tags: ['options', 'call', 'put'] },
  { id: 'ribbon-vaults', name: 'Ribbon Theta Vaults', author: 'Ribbon Finance', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/ribbon.png', description: '自动化期权策略金库，Covered Call和Put Selling收益策略。', downloads: 17500, rating: 4.2, tags: ['options', 'vault', 'theta'] },
  { id: 'mev-blocker', name: 'MEV Blocker', author: 'CoW Protocol', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/shield.png', description: 'MEV保护交易提交，防止三明治攻击和抢跑交易，私密交易通道。', downloads: 36800, rating: 4.5, tags: ['mev', 'protection', 'private-tx'] },
  { id: 'flashbots-protect', name: 'Flashbots Protect', author: 'Flashbots', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/privacy.png', description: 'Flashbots Protect RPC，交易隐私保护和MEV退款机制，支持自定义Builder选择。', downloads: 31200, rating: 4.4, tags: ['mev', 'flashbots', 'rpc'] },
  { id: 'cow-swap', name: 'CoW Swap', author: 'CoW Protocol', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/cow.png', description: 'CoW Protocol批量拍卖交易，最大化剩余价值、MEV保护和Coincidence of Wants匹配。', downloads: 29400, rating: 4.5, tags: ['swap', 'mev-protection', 'batch-auction'] },
  { id: 'copy-trade-pro', name: 'Copy Trade Pro', author: 'MirrorFi', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/copy.png', description: '专业跟单交易系统，多钱包跟踪、延迟控制、仓位比例调整和止损保护。', downloads: 34500, rating: 4.4, tags: ['copy-trade', 'mirror', 'follow'] },
  { id: 'portfolio-rebalancer', name: 'Portfolio Rebalancer', author: 'BalanceAI', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/scales.png', description: '智能投资组合再平衡，目标权重设定、自动调仓和税务优化。', downloads: 22300, rating: 4.3, tags: ['portfolio', 'rebalance', 'allocation'] },
  { id: 'defi-saver', name: 'DeFi Saver Automation', author: 'DeFi Saver', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/lifebuoy.png', description: '借贷仓位自动化管理，自动Boost/Repay、清算保护和一键杠杆调整。', downloads: 25800, rating: 4.5, tags: ['automation', 'leverage', 'protection'] },
  { id: 'limit-order-pro', name: 'Limit Order Pro', author: 'OrderLabs', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/price-tag.png', description: '链上限价单协议，支持多DEX限价单、条件单和TWAP订单执行。', downloads: 27600, rating: 4.3, tags: ['limit-order', 'twap', 'conditional'] },
  { id: 'dca-strategy', name: 'DCA Strategy Bot', author: 'DCALabs', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/recurring-appointment.png', description: '自动化定投策略，支持多链多币种定时定额买入、智能频率调整和成本分析。', downloads: 33100, rating: 4.4, tags: ['dca', 'strategy', 'recurring'] },
  { id: 'arb-scanner', name: 'Arbitrage Scanner', author: 'ArbTech', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/search-in-list.png', description: '跨DEX和跨链套利机会扫描，实时价差监控、利润估算和Gas成本分析。', downloads: 28900, rating: 4.2, tags: ['arbitrage', 'scanner', 'cross-dex'] },
  { id: 'cex-dex-arb', name: 'CEX-DEX Arbitrage', author: 'DeltaFi', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/swap.png', description: 'CEX-DEX套利工具，监控中心化和去中心化交易所之间的价格差异并自动执行。', downloads: 15700, rating: 4.0, tags: ['arbitrage', 'cex', 'dex'] },
  { id: 'bridge-aggregator', name: 'Bridge Aggregator', author: 'SocketTech', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/bridge.png', description: '跨链桥聚合器，比较多个桥的费用和速度，智能选择最优跨链路径。', downloads: 41200, rating: 4.5, tags: ['bridge', 'aggregator', 'cross-chain'] },
  { id: 'li-fi-bridge', name: 'LI.FI Cross-chain', author: 'LI.FI', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/connection-status-on.png', description: 'LI.FI跨链流动性聚合，一站式跨链兑换，集成15+桥和30+ DEX。', downloads: 35400, rating: 4.4, tags: ['bridge', 'swap', 'cross-chain'] },
  { id: 'curve-finance', name: 'Curve Finance', author: 'Curve', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/spiral.png', description: 'Curve稳定币和LST交易池管理，veCRV锁仓、Gauge投票和LP收益追踪。', downloads: 38700, rating: 4.5, tags: ['stableswap', 'curve', 'vecrv'] },
  { id: 'balancer-pool', name: 'Balancer Pool Manager', author: 'Balancer', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/balance-scale.png', description: 'Balancer加权池和Boosted Pool管理，自定义权重分配和veBAL治理。', downloads: 20100, rating: 4.2, tags: ['balancer', 'weighted-pool', 'liquidity'] },
  { id: 'maverick-amm', name: 'Maverick AMM', author: 'Maverick Protocol', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/dynamic.png', description: 'Maverick动态分配AMM，定向流动性策略和自动集中流动性调整。', downloads: 14600, rating: 4.1, tags: ['amm', 'directional', 'dynamic-lp'] },
  { id: 'polymarket-predict', name: 'Polymarket Predictor', author: 'Polymarket', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/crystal-ball.png', description: 'Polymarket预测市场交易，事件合约买卖、概率分析和市场深度查看。', downloads: 43200, rating: 4.6, tags: ['prediction', 'market', 'events'], featured: true },
  { id: 'azuro-betting', name: 'Azuro Betting Protocol', author: 'Azuro', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/dice.png', description: '去中心化体育和事件博彩协议，流动性池投注和赔率分析。', downloads: 12400, rating: 3.9, tags: ['prediction', 'betting', 'sports'] },
  { id: 'nexus-mutual', name: 'Nexus Mutual Insurance', author: 'Nexus Mutual', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/umbrella.png', description: 'DeFi保险协议，智能合约漏洞保险、协议风险保障和理赔管理。', downloads: 18300, rating: 4.2, tags: ['insurance', 'cover', 'risk'] },
  { id: 'insurace-cover', name: 'InsurAce Cover', author: 'InsurAce', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/warranty.png', description: '多链DeFi保险平台，投资组合保险、跨链覆盖和挖矿激励。', downloads: 10200, rating: 3.8, tags: ['insurance', 'multi-chain', 'portfolio-cover'] },
  { id: 'ondo-rwa', name: 'Ondo RWA Tokenization', author: 'Ondo Finance', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/building.png', description: '真实世界资产代币化，美国国债代币OUSG、USDY管理和RWA收益追踪。', downloads: 29800, rating: 4.5, tags: ['rwa', 'tokenization', 'treasury'], featured: true },
  { id: 'maple-finance', name: 'Maple Finance Lending', author: 'Maple', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/leaf.png', description: '机构级DeFi借贷，信用贷款池参与、收益追踪和借款人信用分析。', downloads: 15800, rating: 4.1, tags: ['lending', 'institutional', 'credit'] },
  { id: 'centrifuge-rwa', name: 'Centrifuge RWA', author: 'Centrifuge', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/document.png', description: 'Centrifuge真实世界资产融资，应收账款、房地产代币化和Tinlake池管理。', downloads: 11500, rating: 4.0, tags: ['rwa', 'real-estate', 'invoice'] },
  { id: 'maker-dao', name: 'MakerDAO Vault', author: 'MakerDAO', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/coin-wallet.png', description: 'MakerDAO金库管理，DAI铸造/赎回、抵押率监控和DSR储蓄利率。', downloads: 41800, rating: 4.6, tags: ['maker', 'dai', 'vault'] },
  { id: 'frax-finance', name: 'Frax Finance', author: 'Frax', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/money-transfer.png', description: 'Frax生态系统管理，FRAX铸造、frxETH质押和Fraxlend借贷。', downloads: 19200, rating: 4.2, tags: ['stablecoin', 'staking', 'frax'] },
  { id: 'ethena-usde', name: 'Ethena USDe Manager', author: 'Ethena', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/banknotes.png', description: 'Ethena合成美元USDe铸造/赎回、sUSDe质押收益和Delta中性策略监控。', downloads: 37600, rating: 4.5, tags: ['stablecoin', 'synthetic', 'delta-neutral'] },
  { id: 'across-bridge', name: 'Across Protocol Bridge', author: 'Across', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/arrow-right.png', description: 'Across跨链桥，基于UMA乐观预言机的快速跨链转账和中继者收益。', downloads: 23500, rating: 4.3, tags: ['bridge', 'fast-transfer', 'relayer'] },
  { id: 'symbiotic-restake', name: 'Symbiotic Restaking', author: 'Symbiotic', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/dna.png', description: '通用再质押协议，支持多种抵押品的再质押、网络安全共享和收益叠加。', downloads: 16400, rating: 4.2, tags: ['restaking', 'shared-security', 'multi-asset'] },
  { id: 'karak-restake', name: 'Karak Network Restake', author: 'Karak', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/layers.png', description: 'Karak再质押网络，多资产再质押、DSS安全服务和跨链再质押收益。', downloads: 13200, rating: 4.0, tags: ['restaking', 'dss', 'multi-chain'] },
  { id: 'sommelier-vault', name: 'Sommelier Smart Vaults', author: 'Sommelier', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/wine-glass.png', description: '智能DeFi策略金库，链下计算链上执行的自动化收益策略。', downloads: 14800, rating: 4.1, tags: ['vault', 'strategy', 'automation'] },
  { id: 'gearbox-leverage', name: 'Gearbox Leverage', author: 'Gearbox Protocol', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/gear.png', description: '可组合杠杆协议，借入资金使用其他DeFi协议，杠杆化farming和交易。', downloads: 17900, rating: 4.2, tags: ['leverage', 'composable', 'credit-account'] },
  { id: 'instadapp-lite', name: 'Instadapp Lite', author: 'Instadapp', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/dashboard.png', description: 'DeFi智能账户管理，一键迁移仓位、跨协议操作和自动化Refinancing。', downloads: 20600, rating: 4.3, tags: ['smart-account', 'migration', 'refinance'] },
  { id: 'kamino-finance', name: 'Kamino Finance', author: 'Kamino', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/money-bag.png', description: 'Solana流动性管理和借贷，自动化集中流动性策略和kToken金库。', downloads: 25300, rating: 4.4, tags: ['solana', 'liquidity', 'lending'] },
  { id: 'drift-protocol', name: 'Drift Protocol', author: 'Drift', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/wind.png', description: 'Solana永续合约和现货DEX，虚拟AMM、订单簿混合模式和跟单交易。', downloads: 21400, rating: 4.3, tags: ['solana', 'perp', 'vamm'] },
  { id: 'marinade-stake', name: 'Marinade Staking', author: 'Marinade Finance', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/bbq-grill.png', description: 'Solana流动性质押协议，mSOL铸造、原生质押和验证者委托策略。', downloads: 18700, rating: 4.3, tags: ['solana', 'staking', 'msol'] },
  { id: 'orca-whirlpool', name: 'Orca Whirlpools', author: 'Orca', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/whale.png', description: 'Orca集中流动性Whirlpool管理，LP仓位创建、手续费收割和范围调整。', downloads: 23800, rating: 4.4, tags: ['solana', 'clmm', 'liquidity'] },
  { id: 'gains-network', name: 'Gains Network gTrade', author: 'Gains Network', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/increase.png', description: '去中心化杠杆交易平台，支持加密、外汇和股票指数合成资产交易。', downloads: 16900, rating: 4.1, tags: ['perp', 'forex', 'stocks'] },
  { id: 'kwenta-perps', name: 'Kwenta Perpetuals', author: 'Kwenta', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/futures.png', description: 'Synthetix生态永续合约前端，高级订单类型和跨保证金管理。', downloads: 13500, rating: 4.0, tags: ['perp', 'synthetix', 'advanced-orders'] },
  { id: 'euler-lending', name: 'Euler V2 Lending', author: 'Euler Finance', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/formula.png', description: 'Euler V2模块化借贷协议，自定义风险参数、嵌套金库和反应式利率。', downloads: 15100, rating: 4.2, tags: ['lending', 'modular', 'vault'] },
  { id: 'spark-lending', name: 'Spark Lending', author: 'Spark Protocol', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/sparkling.png', description: 'MakerDAO生态借贷前端，DAI储蓄率访问、ETH借贷和固定利率贷款。', downloads: 19600, rating: 4.3, tags: ['lending', 'maker', 'fixed-rate'] },
  { id: 'velodrome-dex', name: 'Velodrome DEX', author: 'Velodrome', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/bicycle.png', description: 'Optimism核心DEX，ve(3,3)代币经济、投票治理和贿赂市场。', downloads: 17200, rating: 4.2, tags: ['dex', 'optimism', 've33'] },
  { id: 'aerodrome-dex', name: 'Aerodrome DEX', author: 'Aerodrome', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/airport.png', description: 'Base链核心DEX，集中流动性和ve(3,3)模型，Base生态流动性中心。', downloads: 26300, rating: 4.4, tags: ['dex', 'base', 'clmm'] },
  { id: 'trader-joe', name: 'Trader Joe LB', author: 'Trader Joe', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/shopping-bag.png', description: 'Trader Joe Liquidity Book DEX，离散化集中流动性、Bin式做市和自动复利。', downloads: 24100, rating: 4.3, tags: ['dex', 'avalanche', 'liquidity-book'] },
  { id: 'camelot-dex', name: 'Camelot DEX', author: 'Camelot', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/castle.png', description: 'Arbitrum原生DEX，自定义方向性流动性、Nitro池和launchpad。', downloads: 21800, rating: 4.2, tags: ['dex', 'arbitrum', 'launchpad'] },
  { id: 'sushiswap', name: 'SushiSwap Router', author: 'Sushi', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/sushi.png', description: '多链DEX路由器，Trident AMM、Bentobox金库和Kashi借贷。', downloads: 35200, rating: 4.3, tags: ['dex', 'multichain', 'bentobox'] },
  { id: 'thena-fi', name: 'THENA Finance', author: 'THENA', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/spartan-helmet.png', description: 'BNB Chain ve(3,3) DEX，集中流动性FUSION模式和永续合约ARENA。', downloads: 18500, rating: 4.1, tags: ['dex', 'bsc', 've33'] },
  { id: 'ambient-finance', name: 'Ambient Finance', author: 'Ambient', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/air-element.png', description: '零Gas集中流动性DEX，单合约架构实现极低Gas成本的流动性管理。', downloads: 15300, rating: 4.2, tags: ['dex', 'zero-gas', 'singleton'] },
  { id: 'fluid-dex', name: 'Fluid DEX', author: 'Instadapp', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/water-element.png', description: 'Fluid智能债务DEX，利用借贷协议债务作为交易流动性，资本效率提升10倍。', downloads: 19200, rating: 4.4, tags: ['dex', 'smart-debt', 'capital-efficiency'] },
  { id: 'morpho-blue', name: 'Morpho Blue Markets', author: 'Morpho', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/circled-b.png', description: 'Morpho Blue无许可借贷市场，自定义风险参数和无治理开销的最小化协议。', downloads: 22700, rating: 4.4, tags: ['lending', 'permissionless', 'minimal'] },
  { id: 'benqi-lending', name: 'BENQI Lending', author: 'BENQI', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/snow.png', description: 'Avalanche借贷协议，流动性质押sAVAX和借贷市场管理。', downloads: 16800, rating: 4.1, tags: ['avalanche', 'lending', 'liquid-staking'] },
  { id: 'venus-protocol', name: 'Venus Protocol', author: 'Venus', category: 'DeFi & Trading', icon: 'https://img.icons8.com/fluency/96/sun.png', description: 'BNB Chain借贷协议，隔离池、稳定币VAI铸造和多资产市场。', downloads: 25400, rating: 4.3, tags: ['bsc', 'lending', 'isolated-pool'] },

  // --- Data & Analytics ---
  { id: 'opennews', name: 'OpenNews', author: '6551.io', category: 'Data & Analytics', icon: 'https://img.icons8.com/fluency/96/news.png', description: '加密货币新闻搜索、AI评分、交易信号和实时推送。支持关键词搜索、币种过滤和来源筛选。', downloads: 112000, rating: 4.9, tags: ['news', 'ai', 'signal'], featured: true },
  { id: 'opentwitter', name: 'OpenTwitter', author: '6551.io', category: 'Data & Analytics', icon: 'https://img.icons8.com/fluency/96/twitter.png', description: 'Twitter/X数据接口，支持用户搜索、推文搜索、KOL追踪、删推监测。', downloads: 98700, rating: 4.8, tags: ['twitter', 'kol', 'social'], featured: true },
  { id: 'dune-analytics', name: 'Dune Analytics', author: 'Dune', category: 'Data & Analytics', icon: 'https://img.icons8.com/fluency/96/bar-chart.png', description: '链上数据查询和可视化，自定义SQL查询，社区仪表盘。', downloads: 78400, rating: 4.7, tags: ['analytics', 'sql', 'dashboard'] },
  { id: 'nansen-alpha', name: 'Nansen Alpha', author: 'Nansen', category: 'Data & Analytics', icon: 'https://img.icons8.com/fluency/96/detective.png', description: '链上地址标签、Smart Money追踪、NFT分析和预警系统。', downloads: 65300, rating: 4.6, tags: ['smart-money', 'labels', 'tracking'] },
  { id: 'defi-llama', name: 'DefiLlama Stats', author: 'DefiLlama', category: 'Data & Analytics', icon: 'https://img.icons8.com/fluency/96/llama.png', description: 'DeFi协议TVL排行、收益率追踪、跨链数据聚合分析。', downloads: 58200, rating: 4.5, tags: ['tvl', 'defi', 'yield'] },
  { id: 'glassnode', name: 'Glassnode Insights', author: 'Glassnode', category: 'Data & Analytics', icon: 'https://img.icons8.com/fluency/96/crystal-ball.png', description: '比特币和以太坊链上指标分析，NUPL、SOPR等高级指标。', downloads: 42100, rating: 4.4, tags: ['btc', 'eth', 'onchain'] },
  { id: 'arkham-intel', name: 'Arkham Intelligence', author: 'Arkham', category: 'Data & Analytics', icon: 'https://img.icons8.com/fluency/96/spy.png', description: '地址实体识别和资金流追踪，巨鲸钱包监控和预警。', downloads: 39800, rating: 4.5, tags: ['whale', 'tracking', 'entity'] },
  { id: 'token-terminal', name: 'Token Terminal', author: 'Token Terminal', category: 'Data & Analytics', icon: 'https://img.icons8.com/fluency/96/area-chart.png', description: '加密协议财务数据，收入、费用、P/E等传统金融指标。', downloads: 31200, rating: 4.3, tags: ['fundamentals', 'revenue', 'metrics'] },
  { id: 'messari-research', name: 'Messari Research', author: 'Messari', category: 'Data & Analytics', icon: 'https://img.icons8.com/fluency/96/search.png', description: '加密货币研究报告、资产档案和行业分类数据。', downloads: 28900, rating: 4.2, tags: ['research', 'report', 'taxonomy'] },
  { id: 'santiment', name: 'Santiment Signals', author: 'Santiment', category: 'Data & Analytics', icon: 'https://img.icons8.com/fluency/96/signal.png', description: '社交情绪分析、开发活跃度追踪、网络活动预警。', downloads: 25100, rating: 4.1, tags: ['sentiment', 'social', 'dev-activity'] },
  { id: 'kaito-ai', name: 'Kaito AI Search', author: 'Kaito', category: 'Data & Analytics', icon: 'https://img.icons8.com/fluency/96/brain.png', description: 'AI驱动的加密信息搜索引擎，全网话题追踪、KOL影响力分析和叙事趋势识别。', downloads: 46800, rating: 4.7, tags: ['ai-search', 'narrative', 'kol'], featured: true },
  { id: 'rootdata', name: 'RootData Intelligence', author: 'RootData', category: 'Data & Analytics', icon: 'https://img.icons8.com/fluency/96/tree-structure.png', description: 'Web3项目融资数据库，投资机构追踪、项目估值分析和赛道热度地图。', downloads: 35400, rating: 4.4, tags: ['funding', 'vc', 'project'] },
  { id: 'bubblemaps', name: 'Bubblemaps Visualizer', author: 'Bubblemaps', category: 'Data & Analytics', icon: 'https://img.icons8.com/fluency/96/rgb-circle-3.png', description: '代币持仓关系可视化，气泡图展示持有者关联性、老鼠仓检测和链上关系图谱。', downloads: 28300, rating: 4.3, tags: ['visualization', 'holders', 'cluster'] },
  { id: 'dexscreener', name: 'DEXScreener Live', author: 'DEXScreener', category: 'Data & Analytics', icon: 'https://img.icons8.com/fluency/96/monitor.png', description: '实时DEX交易对监控，新池检测、价格警报、多链交易数据看板。', downloads: 82600, rating: 4.8, tags: ['dex', 'screener', 'live'], featured: true },
  { id: 'birdeye', name: 'Birdeye Analytics', author: 'Birdeye', category: 'Data & Analytics', icon: 'https://img.icons8.com/fluency/96/eagle.png', description: 'Solana生态DeFi数据分析，代币价格聚合、交易者分析和Portfolio追踪。', downloads: 54200, rating: 4.6, tags: ['solana', 'analytics', 'portfolio'] },
  { id: 'gmgn-tracker', name: 'GMGN Smart Money', author: 'GMGN', category: 'Data & Analytics', icon: 'https://img.icons8.com/fluency/96/money.png', description: '聪明钱地址追踪，链上利润排行、钱包PnL分析和新币聪明钱流入监控。', downloads: 67800, rating: 4.7, tags: ['smart-money', 'pnl', 'tracking'], featured: true },
  { id: 'cielo-feed', name: 'Cielo Wallet Feed', author: 'Cielo', category: 'Data & Analytics', icon: 'https://img.icons8.com/fluency/96/binoculars.png', description: '链上钱包动态实时追踪，多地址监控、交易分类和实时通知。', downloads: 31500, rating: 4.3, tags: ['wallet-tracking', 'feed', 'notifications'] },
  { id: 'lunarcrush', name: 'LunarCrush Social', author: 'LunarCrush', category: 'Data & Analytics', icon: 'https://img.icons8.com/fluency/96/full-moon.png', description: '加密社交媒体情绪分析，Galaxy Score评分、社交互动量追踪和KOL影响力排名。', downloads: 38200, rating: 4.4, tags: ['social', 'sentiment', 'galaxy-score'] },
  { id: 'coingecko-api', name: 'CoinGecko Data', author: 'CoinGecko', category: 'Data & Analytics', icon: 'https://img.icons8.com/fluency/96/gecko.png', description: 'CoinGecko全面代币数据API，市值排名、历史价格、交易所数据和NFT地板价。', downloads: 71200, rating: 4.5, tags: ['market-data', 'api', 'comprehensive'] },

  // --- AI & Automation ---
  { id: 'self-improving-agent', name: 'Self-Improving Agent', author: 'pskoett', category: 'AI & Automation', icon: 'https://img.icons8.com/fluency/96/robot.png', description: '自我学习和优化的AI代理，能够自动迭代改进代码和策略。', downloads: 82100, rating: 4.8, tags: ['ai', 'agent', 'self-improve'], featured: true },
  { id: 'impeccable-skill', name: 'Impeccable Skill', author: 'ClawHub', category: 'AI & Automation', icon: 'https://img.icons8.com/fluency/96/diamond.png', description: '代码质量检测和自动修复，UI/UX审查和优化建议。', downloads: 71500, rating: 4.7, tags: ['quality', 'review', 'fix'] },
  { id: 'auto-trader-bot', name: 'Auto Trader Bot', author: 'CryptoAI', category: 'AI & Automation', icon: 'https://img.icons8.com/fluency/96/bot.png', description: 'AI驱动的自动化交易策略，支持网格、DCA和趋势跟踪。', downloads: 67800, rating: 4.5, tags: ['trading', 'bot', 'strategy'] },
  { id: 'mev-searcher', name: 'MEV Searcher', author: 'Flashbots', category: 'AI & Automation', icon: 'https://img.icons8.com/fluency/96/flash-on.png', description: '链上MEV机会检测，三明治攻击防护和套利发现。', downloads: 45200, rating: 4.3, tags: ['mev', 'arbitrage', 'flashbots'] },
  { id: 'sniper-bot', name: 'Token Sniper', author: 'SniperLabs', category: 'AI & Automation', icon: 'https://img.icons8.com/fluency/96/target.png', description: '新代币上线狙击，支持自动买入、止盈止损和反Rug检测。', downloads: 58900, rating: 4.4, tags: ['sniper', 'newtoken', 'auto-buy'] },
  { id: 'copy-trade', name: 'Copy Trade Agent', author: 'TradeSync', category: 'AI & Automation', icon: 'https://img.icons8.com/fluency/96/copy.png', description: '跟单交易代理，追踪聪明钱地址并自动复制交易操作。', downloads: 52300, rating: 4.6, tags: ['copy-trade', 'smart-money', 'follow'], featured: true },
  { id: 'airdrop-hunter', name: 'Airdrop Hunter', author: 'AirdropDAO', category: 'AI & Automation', icon: 'https://img.icons8.com/fluency/96/parachute.png', description: '空投机会发现和自动化交互，链上活跃度管理。', downloads: 48700, rating: 4.2, tags: ['airdrop', 'farming', 'interact'] },
  { id: 'nft-mint-bot', name: 'NFT Mint Bot', author: 'MintLab', category: 'AI & Automation', icon: 'https://img.icons8.com/fluency/96/picture.png', description: 'NFT自动Mint和白名单抢购，支持多链和Gas优化。', downloads: 35600, rating: 4.1, tags: ['nft', 'mint', 'whitelist'] },
  { id: 'yield-optimizer', name: 'Yield Optimizer', author: 'YieldAI', category: 'AI & Automation', icon: 'https://img.icons8.com/fluency/96/growing-money.png', description: 'DeFi收益自动化管理，智能再平衡和最优策略推荐。', downloads: 31200, rating: 4.3, tags: ['yield', 'defi', 'rebalance'] },
  { id: 'rug-detector', name: 'Rug Detector', author: 'SafeAI', category: 'AI & Automation', icon: 'https://img.icons8.com/fluency/96/shield.png', description: '合约安全检测和Rug Pull风险评估，实时预警系统。', downloads: 44100, rating: 4.5, tags: ['security', 'rug', 'audit'] },
  { id: 'narrative-hunter', name: 'Narrative Hunter', author: 'SmallClaw', category: 'AI & Automation', icon: 'https://img.icons8.com/fluency/96/compass.png', description: '实时热点叙事追踪，AI多维度评分、KOL讨论热度分析和叙事驱动代币发现。', downloads: 56200, rating: 4.7, tags: ['narrative', 'trending', 'ai-scoring'], featured: true },
  { id: 'meme-signal', name: 'Meme Signal Detector', author: 'SmallClaw', category: 'AI & Automation', icon: 'https://img.icons8.com/fluency/96/radar-plot.png', description: '多链Meme代币信号检测，聪明钱/KOL/巨鲸五维加权评分和实时推送。', downloads: 48700, rating: 4.6, tags: ['meme', 'signal', 'whale'], featured: true },
  { id: 'auto-deployer', name: 'Auto Token Deployer', author: 'SmallClaw', category: 'AI & Automation', icon: 'https://img.icons8.com/fluency/96/launched-rocket.png', description: '自动化代币发射，支持Jumpbot/Four.meme/Flap.sh多平台，叙事驱动自动创建Meme币。', downloads: 39800, rating: 4.5, tags: ['deploy', 'meme', 'auto-launch'] },
  { id: 'sentiment-analyzer', name: 'Sentiment Analyzer', author: 'SentimentAI', category: 'AI & Automation', icon: 'https://img.icons8.com/fluency/96/happy.png', description: 'AI市场情绪分析，恐惧贪婪指数实时计算、社媒情绪趋势和反转信号检测。', downloads: 33500, rating: 4.3, tags: ['sentiment', 'fear-greed', 'reversal'] },
  { id: 'whale-alert-bot', name: 'Whale Alert Bot', author: 'WhaleAI', category: 'AI & Automation', icon: 'https://img.icons8.com/fluency/96/whale.png', description: '巨鲸交易实时监控，大额转账追踪、交易所充提分析和价格影响预测。', downloads: 41200, rating: 4.4, tags: ['whale', 'alert', 'large-transfer'] },
  { id: 'grid-trader', name: 'Grid Trading Bot', author: 'GridLabs', category: 'AI & Automation', icon: 'https://img.icons8.com/fluency/96/grid-3.png', description: '自动化网格交易策略，支持等差/等比网格、回测优化和多币种并行运行。', downloads: 29800, rating: 4.2, tags: ['grid', 'bot', 'strategy'] },
  { id: 'token-launcher-ai', name: 'Token Launcher AI', author: 'LaunchPadAI', category: 'AI & Automation', icon: 'https://img.icons8.com/fluency/96/spacecraft.png', description: 'AI智能代币发射助手，自动生成代币名称、Logo和社交媒体内容，多链一键部署。', downloads: 35600, rating: 4.3, tags: ['launch', 'ai-generated', 'multichain'] },

  // --- Wallet & Infrastructure ---
  { id: 'metamask-connector', name: 'MetaMask Connector', author: 'MetaMask', category: 'Wallet & Infra', icon: 'https://img.icons8.com/color/96/metamask-logo.png', description: 'MetaMask钱包集成和交互，签名、交易和网络管理。', downloads: 135000, rating: 4.9, tags: ['wallet', 'metamask', 'connect'], featured: true },
  { id: 'walletconnect', name: 'WalletConnect V2', author: 'WalletConnect', category: 'Wallet & Infra', icon: 'https://img.icons8.com/color/96/qr-code.png', description: '跨钱包连接协议，支持200+钱包和多链交互。', downloads: 98500, rating: 4.7, tags: ['connect', 'multi-wallet', 'protocol'] },
  { id: 'chainlink-oracle', name: 'Chainlink Oracle', author: 'Chainlink', category: 'Wallet & Infra', icon: 'https://img.icons8.com/color/96/chain.png', description: '链上预言机数据，价格Feed、VRF随机数和Automation。', downloads: 72300, rating: 4.6, tags: ['oracle', 'price-feed', 'vrf'] },
  { id: 'etherscan-api', name: 'Etherscan Explorer', author: 'Etherscan', category: 'Wallet & Infra', icon: 'https://img.icons8.com/fluency/96/blockchain-technology.png', description: '以太坊区块链浏览器API，合约验证、交易查询和ABI解析。', downloads: 85600, rating: 4.5, tags: ['explorer', 'contract', 'verify'] },
  { id: 'alchemy-sdk', name: 'Alchemy SDK', author: 'Alchemy', category: 'Wallet & Infra', icon: 'https://img.icons8.com/fluency/96/test-tube.png', description: '区块链基础设施SDK，增强型API、Webhook和NFT查询。', downloads: 68900, rating: 4.6, tags: ['infra', 'api', 'webhook'] },
  { id: 'infura-connect', name: 'Infura Connect', author: 'Infura', category: 'Wallet & Infra', icon: 'https://img.icons8.com/fluency/96/cloud-connection.png', description: '以太坊和IPFS节点服务，JSON-RPC接入和IPFS文件存储。', downloads: 55200, rating: 4.4, tags: ['node', 'rpc', 'ipfs'] },
  { id: 'safe-multisig', name: 'Safe Multisig', author: 'Safe', category: 'Wallet & Infra', icon: 'https://img.icons8.com/fluency/96/lock.png', description: '多签钱包管理，交易审批流程和权限控制。', downloads: 41200, rating: 4.5, tags: ['multisig', 'safe', 'governance'] },
  { id: 'graph-protocol', name: 'The Graph', author: 'The Graph', category: 'Wallet & Infra', icon: 'https://img.icons8.com/fluency/96/graph.png', description: '去中心化索引协议，Subgraph查询和链上数据索引。', downloads: 48700, rating: 4.4, tags: ['indexing', 'subgraph', 'query'] },
  { id: 'ipfs-storage', name: 'IPFS Storage', author: 'Protocol Labs', category: 'Wallet & Infra', icon: 'https://img.icons8.com/fluency/96/folder-tree.png', description: '去中心化文件存储，支持NFT元数据和DApp资源托管。', downloads: 38500, rating: 4.3, tags: ['ipfs', 'storage', 'decentralized'] },
  { id: 'phantom-wallet', name: 'Phantom Wallet', author: 'Phantom', category: 'Wallet & Infra', icon: 'https://img.icons8.com/fluency/96/ghost.png', description: 'Solana钱包集成，支持代币交易、NFT管理和DApp连接。', downloads: 62100, rating: 4.7, tags: ['solana', 'wallet', 'phantom'] },
  { id: 'okx-wallet', name: 'OKX Wallet', author: 'OKX', category: 'Wallet & Infra', icon: 'https://www.okx.com/cdn/assets/imgs/2112/A91FEF66E005CF47.png', description: 'OKX Web3钱包集成，多链资产管理、DApp浏览器和MPC无私钥钱包。', downloads: 78500, rating: 4.7, tags: ['wallet', 'multichain', 'mpc'], featured: true },
  { id: 'bitget-wallet', name: 'Bitget Wallet', author: 'Bitget', category: 'Wallet & Infra', icon: 'https://img.icons8.com/fluency/96/wallet.png', description: 'Bitget Web3钱包集成，Swap聚合、NFT市场和DApp发现。', downloads: 52300, rating: 4.5, tags: ['wallet', 'swap', 'nft'] },
  { id: 'rabby-wallet', name: 'Rabby Wallet', author: 'DeBank', category: 'Wallet & Infra', icon: 'https://img.icons8.com/fluency/96/fox.png', description: 'Rabby钱包连接，交易预执行模拟、风险提示和多链无缝切换。', downloads: 45200, rating: 4.6, tags: ['wallet', 'simulation', 'security'] },
  { id: 'pimlico-aa', name: 'Pimlico Account Abstraction', author: 'Pimlico', category: 'Wallet & Infra', icon: 'https://img.icons8.com/fluency/96/abstract.png', description: 'ERC-4337账户抽象基础设施，Paymaster免Gas、Bundler和Smart Account SDK。', downloads: 28700, rating: 4.4, tags: ['aa', 'erc4337', 'paymaster'] },
  { id: 'gelato-relay', name: 'Gelato Relay', author: 'Gelato Network', category: 'Wallet & Infra', icon: 'https://img.icons8.com/fluency/96/ice-cream-sundae.png', description: 'Gelato去中心化自动化中继，免Gas元交易、Web3 Functions和Automate任务。', downloads: 32100, rating: 4.3, tags: ['relay', 'gasless', 'automation'] },
  { id: 'pyth-oracle', name: 'Pyth Network Oracle', author: 'Pyth', category: 'Wallet & Infra', icon: 'https://img.icons8.com/fluency/96/crystal-ball.png', description: 'Pyth高频价格预言机，亚秒级更新的价格数据、置信区间和多链支持。', downloads: 41600, rating: 4.5, tags: ['oracle', 'high-frequency', 'price-feed'] },
  { id: 'arweave-storage', name: 'Arweave Permanent Storage', author: 'Arweave', category: 'Wallet & Infra', icon: 'https://img.icons8.com/fluency/96/hard-drive.png', description: 'Arweave永久存储协议，一次付费永久存储、Bundlr上传和GraphQL查询。', downloads: 26800, rating: 4.3, tags: ['storage', 'permanent', 'arweave'] },

  // --- Security & Audit ---
  { id: 'slither-analyzer', name: 'Slither Analyzer', author: 'Trail of Bits', category: 'Security & Audit', icon: 'https://img.icons8.com/fluency/96/bug.png', description: 'Solidity静态分析工具，自动检测合约漏洞和安全问题。', downloads: 56700, rating: 4.7, tags: ['audit', 'solidity', 'vulnerability'], featured: true },
  { id: 'mythril-scan', name: 'Mythril Scanner', author: 'ConsenSys', category: 'Security & Audit', icon: 'https://img.icons8.com/fluency/96/scan.png', description: 'EVM字节码安全分析，符号执行和漏洞检测。', downloads: 42300, rating: 4.5, tags: ['mythril', 'bytecode', 'symbolic'] },
  { id: 'certik-check', name: 'CertiK Check', author: 'CertiK', category: 'Security & Audit', icon: 'https://img.icons8.com/fluency/96/verified-account.png', description: '项目安全评分和审计报告查询，Skynet实时监控。', downloads: 51200, rating: 4.6, tags: ['certik', 'score', 'monitor'] },
  { id: 'go-plus-security', name: 'GoPlus Security', author: 'GoPlus', category: 'Security & Audit', icon: 'https://img.icons8.com/fluency/96/security-checked.png', description: '代币安全检测API，貔貅检测、合约风险评估和恶意地址识别。', downloads: 63400, rating: 4.6, tags: ['token-security', 'honeypot', 'risk'], featured: true },
  { id: 'forta-alerts', name: 'Forta Alerts', author: 'Forta', category: 'Security & Audit', icon: 'https://img.icons8.com/fluency/96/alarm.png', description: '链上安全监控和威胁检测网络，实时攻击预警。', downloads: 35800, rating: 4.4, tags: ['alert', 'threat', 'monitoring'] },
  { id: 'openzeppelin', name: 'OpenZeppelin Guard', author: 'OpenZeppelin', category: 'Security & Audit', icon: 'https://img.icons8.com/fluency/96/castle.png', description: '安全合约库和最佳实践模板，Defender自动化安全。', downloads: 78900, rating: 4.8, tags: ['contracts', 'library', 'defender'] },
  { id: 'tenderly-sim', name: 'Tenderly Simulator', author: 'Tenderly', category: 'Security & Audit', icon: 'https://img.icons8.com/fluency/96/experiment.png', description: '交易模拟和调试，Fork测试环境和Gas分析。', downloads: 38200, rating: 4.5, tags: ['simulate', 'debug', 'fork'] },
  { id: 'solidproof', name: 'SolidProof Audit', author: 'SolidProof', category: 'Security & Audit', icon: 'https://img.icons8.com/fluency/96/approval.png', description: 'KYC验证和智能合约审计服务，链上信任评分。', downloads: 22100, rating: 4.0, tags: ['kyc', 'audit', 'trust'] },
  { id: 'dedaub-analyzer', name: 'Dedaub Contract Analyzer', author: 'Dedaub', category: 'Security & Audit', icon: 'https://img.icons8.com/fluency/96/search-property.png', description: '智能合约反编译和漏洞分析，字节码逆向工程和安全报告自动生成。', downloads: 28700, rating: 4.4, tags: ['decompiler', 'analysis', 'bytecode'] },
  { id: 'chainalysis-risk', name: 'Chainalysis Risk', author: 'Chainalysis', category: 'Security & Audit', icon: 'https://img.icons8.com/fluency/96/warning-shield.png', description: '链上风险评估和合规检测，地址制裁名单查询、风险评分和交易溯源。', downloads: 35200, rating: 4.5, tags: ['risk', 'compliance', 'sanctions'] },
  { id: 'immunefi-bounty', name: 'Immunefi Bug Bounty', author: 'Immunefi', category: 'Security & Audit', icon: 'https://img.icons8.com/fluency/96/bug-report.png', description: 'Web3最大漏洞赏金平台，漏洞提交、赏金追踪和安全研究员排行。', downloads: 19800, rating: 4.2, tags: ['bounty', 'vulnerability', 'research'] },
  { id: 'token-sniffer', name: 'Token Sniffer', author: 'Token Sniffer', category: 'Security & Audit', icon: 'https://img.icons8.com/fluency/96/dog-nose-print.png', description: '自动化合约安全嗅探，貔貅检测、隐藏铸造权限和流动性锁定验证。', downloads: 48300, rating: 4.5, tags: ['honeypot', 'contract-check', 'liquidity-lock'] },

  // --- Social & Community ---
  { id: 'discord-bot', name: 'Discord Bot Kit', author: 'DiscordDev', category: 'Social & Community', icon: 'https://img.icons8.com/fluency/96/discord-logo.png', description: 'Discord机器人开发框架，社区管理、空投通知和价格提醒。', downloads: 89200, rating: 4.6, tags: ['discord', 'bot', 'community'], featured: true },
  { id: 'telegram-alert', name: 'Telegram Alert', author: 'TGBot', category: 'Social & Community', icon: 'https://img.icons8.com/fluency/96/telegram-app.png', description: 'Telegram消息推送和交易提醒，群组管理和指令系统。', downloads: 76500, rating: 4.5, tags: ['telegram', 'alert', 'notification'] },
  { id: 'lens-protocol', name: 'Lens Protocol', author: 'Aave', category: 'Social & Community', icon: 'https://img.icons8.com/fluency/96/glasses.png', description: '去中心化社交图谱，Profile NFT和内容发布。', downloads: 34200, rating: 4.3, tags: ['social', 'lens', 'web3-social'] },
  { id: 'farcaster-cast', name: 'Farcaster Hub', author: 'Farcaster', category: 'Social & Community', icon: 'https://img.icons8.com/fluency/96/radio-tower.png', description: 'Farcaster协议集成，Cast发布和社交图谱查询。', downloads: 42100, rating: 4.4, tags: ['farcaster', 'cast', 'social'] },
  { id: 'snapshot-vote', name: 'Snapshot Vote', author: 'Snapshot', category: 'Social & Community', icon: 'https://img.icons8.com/fluency/96/vote.png', description: '链下治理投票，提案创建和投票统计。', downloads: 38900, rating: 4.3, tags: ['governance', 'vote', 'dao'] },
  { id: 'guild-xyz', name: 'Guild.xyz Access', author: 'Guild.xyz', category: 'Social & Community', icon: 'https://img.icons8.com/fluency/96/key.png', description: '基于代币/NFT的访问控制和社区门控系统。', downloads: 29800, rating: 4.2, tags: ['access', 'gating', 'community'] },
  { id: 'mirror-publish', name: 'Mirror Publisher', author: 'Mirror', category: 'Social & Community', icon: 'https://img.icons8.com/fluency/96/pen.png', description: '去中心化内容发布平台，NFT文章铸造和写作激励。', downloads: 25600, rating: 4.1, tags: ['publish', 'writing', 'nft'] },
  { id: 'debank-social', name: 'DeBank Social', author: 'DeBank', category: 'Social & Community', icon: 'https://img.icons8.com/fluency/96/user-group-man-man.png', description: 'Web3社交平台集成，链上身份展示、DeFi投资组合社交分享和Web3 Badge。', downloads: 41200, rating: 4.4, tags: ['social', 'profile', 'web3-identity'] },
  { id: 'galxe-quest', name: 'Galxe Quest Builder', author: 'Galxe', category: 'Social & Community', icon: 'https://img.icons8.com/fluency/96/trophy.png', description: 'Galxe链上任务和凭证系统，Quest创建、OAT铸造和社区增长工具。', downloads: 52300, rating: 4.5, tags: ['quest', 'credential', 'growth'], featured: true },
  { id: 'cyberconnect', name: 'CyberConnect Social', author: 'CyberConnect', category: 'Social & Community', icon: 'https://img.icons8.com/fluency/96/connected-people.png', description: '去中心化社交图谱协议，W3ST灵魂绑定代币和链上社交关系。', downloads: 23800, rating: 4.2, tags: ['social-graph', 'sbt', 'connection'] },
  { id: 'push-protocol', name: 'Push Protocol', author: 'Push', category: 'Social & Community', icon: 'https://img.icons8.com/fluency/96/bell.png', description: 'Web3通知和消息协议，链上事件推送、钱包间聊天和频道订阅。', downloads: 31500, rating: 4.3, tags: ['notification', 'messaging', 'push'] },

  // --- NFT & Gaming ---
  { id: 'opensea-sdk', name: 'OpenSea SDK', author: 'OpenSea', category: 'NFT & Gaming', icon: 'https://img.icons8.com/fluency/96/ocean-wave.png', description: 'NFT市场集成，挂单、竞拍和Collection管理。', downloads: 68900, rating: 4.5, tags: ['nft', 'marketplace', 'opensea'], featured: true },
  { id: 'blur-api', name: 'Blur Trading', author: 'Blur', category: 'NFT & Gaming', icon: 'https://img.icons8.com/fluency/96/speed.png', description: 'NFT交易和地板价追踪，专业交易者工具。', downloads: 45200, rating: 4.4, tags: ['nft', 'trading', 'floor'] },
  { id: 'magiceden', name: 'Magic Eden Tools', author: 'Magic Eden', category: 'NFT & Gaming', icon: 'https://img.icons8.com/fluency/96/magic-wand.png', description: 'Solana和比特币NFT市场，Ordinals和BRC-20交易。', downloads: 52300, rating: 4.5, tags: ['nft', 'solana', 'ordinals'] },
  { id: 'axie-infinity', name: 'Axie Analytics', author: 'Sky Mavis', category: 'NFT & Gaming', icon: 'https://img.icons8.com/fluency/96/joystick.png', description: 'Axie Infinity游戏数据分析，资产估值和收益追踪。', downloads: 21500, rating: 4.0, tags: ['gaming', 'axie', 'p2e'] },
  { id: 'nft-rarity', name: 'NFT Rarity Sniper', author: 'RarityTools', category: 'NFT & Gaming', icon: 'https://img.icons8.com/fluency/96/star.png', description: 'NFT稀有度排名和实时揭示追踪，Collection分析。', downloads: 38700, rating: 4.3, tags: ['rarity', 'reveal', 'ranking'] },
  { id: 'tensor-nft', name: 'Tensor NFT Trading', author: 'Tensor', category: 'NFT & Gaming', icon: 'https://img.icons8.com/fluency/96/3d-printer.png', description: 'Solana NFT专业交易平台，集合竞价、实时扫地板和NFT AMM流动性池。', downloads: 42100, rating: 4.5, tags: ['solana', 'nft-trading', 'amm'] },
  { id: 'zora-mint', name: 'Zora Creator Tools', author: 'Zora', category: 'NFT & Gaming', icon: 'https://img.icons8.com/fluency/96/paint-palette.png', description: 'Zora NFT创作和铸造平台，创作者经济、免费铸造和协议收入分成。', downloads: 35800, rating: 4.4, tags: ['creator', 'mint', 'free-mint'] },
  { id: 'treasure-dao', name: 'Treasure DAO Gaming', author: 'Treasure', category: 'NFT & Gaming', icon: 'https://img.icons8.com/fluency/96/treasure-chest.png', description: 'Arbitrum游戏生态平台，Trove NFT市场、MagicSwap和游戏基础设施。', downloads: 18500, rating: 4.1, tags: ['gaming', 'arbitrum', 'marketplace'] },
  { id: 'immutable-x', name: 'Immutable X Gaming', author: 'Immutable', category: 'NFT & Gaming', icon: 'https://img.icons8.com/fluency/96/game-controller.png', description: 'Immutable X游戏NFT基础设施，零Gas NFT铸造和交易、Passport钱包集成。', downloads: 31200, rating: 4.3, tags: ['gaming', 'zero-gas', 'l2'] },

  // --- Dev Tools ---
  { id: 'hardhat-toolkit', name: 'Hardhat Toolkit', author: 'Nomic Foundation', category: 'Dev Tools', icon: 'https://img.icons8.com/fluency/96/hard-hat.png', description: 'Solidity开发环境，合约编译、测试和部署自动化。', downloads: 95200, rating: 4.8, tags: ['solidity', 'dev', 'test'], featured: true },
  { id: 'foundry-forge', name: 'Foundry Forge', author: 'Paradigm', category: 'Dev Tools', icon: 'https://img.icons8.com/fluency/96/anvil.png', description: '高性能Solidity测试框架，Fuzz测试和Gas优化。', downloads: 78900, rating: 4.7, tags: ['foundry', 'testing', 'gas'] },
  { id: 'remix-ide', name: 'Remix IDE Connect', author: 'Remix', category: 'Dev Tools', icon: 'https://img.icons8.com/fluency/96/code.png', description: 'Remix IDE远程连接，合约编辑和实时调试。', downloads: 62300, rating: 4.5, tags: ['ide', 'debug', 'remix'] },
  { id: 'wagmi-hooks', name: 'Wagmi Hooks', author: 'wevm', category: 'Dev Tools', icon: 'https://img.icons8.com/fluency/96/hook.png', description: 'React Hooks for Ethereum，类型安全的合约交互。', downloads: 55600, rating: 4.6, tags: ['react', 'hooks', 'typescript'] },
  { id: 'viem-client', name: 'Viem Client', author: 'wevm', category: 'Dev Tools', icon: 'https://img.icons8.com/fluency/96/module.png', description: '轻量级以太坊交互库，TypeScript原生支持。', downloads: 48200, rating: 4.5, tags: ['typescript', 'ethereum', 'lightweight'] },
  { id: 'subgraph-studio', name: 'Subgraph Studio', author: 'The Graph', category: 'Dev Tools', icon: 'https://img.icons8.com/fluency/96/database.png', description: 'Subgraph开发和部署工具，GraphQL Schema设计和查询优化。', downloads: 35100, rating: 4.3, tags: ['subgraph', 'graphql', 'index'] },
  { id: 'solana-anchor', name: 'Anchor Framework', author: 'Coral', category: 'Dev Tools', icon: 'https://img.icons8.com/fluency/96/anchor.png', description: 'Solana程序开发框架，IDL生成和客户端SDK。', downloads: 42800, rating: 4.6, tags: ['solana', 'anchor', 'rust'] },
  { id: 'thirdweb-deploy', name: 'Thirdweb Deploy', author: 'Thirdweb', category: 'Dev Tools', icon: 'https://img.icons8.com/fluency/96/upload.png', description: '一键合约部署和SDK生成，支持EVM所有链。', downloads: 51300, rating: 4.5, tags: ['deploy', 'sdk', 'multichain'] },
  { id: 'tenderly-devnets', name: 'Tenderly DevNets', author: 'Tenderly', category: 'Dev Tools', icon: 'https://img.icons8.com/fluency/96/test-tube.png', description: 'Tenderly开发网络，主网Fork环境、交易调试和Gas Profile优化。', downloads: 43200, rating: 4.5, tags: ['devnet', 'fork', 'debug'] },
  { id: 'abi-ninja', name: 'ABI Ninja', author: 'ABITools', category: 'Dev Tools', icon: 'https://img.icons8.com/fluency/96/katana.png', description: '智能合约ABI解析和交互工具，自动检测代理合约、读写函数调用和事件解码。', downloads: 27800, rating: 4.2, tags: ['abi', 'contract', 'interact'] },
  { id: 'scaffold-eth', name: 'Scaffold-ETH 2', author: 'BuidlGuidl', category: 'Dev Tools', icon: 'https://img.icons8.com/fluency/96/engineering.png', description: '以太坊DApp快速开发脚手架，Hardhat+Next.js模板、热重载和合约调试UI。', downloads: 38500, rating: 4.6, tags: ['scaffold', 'template', 'nextjs'] },
  { id: 'chainide', name: 'ChainIDE Cloud', author: 'ChainIDE', category: 'Dev Tools', icon: 'https://img.icons8.com/fluency/96/cloud-development.png', description: '云端智能合约IDE，支持多链开发、一键编译部署和AI辅助编码。', downloads: 22100, rating: 4.1, tags: ['ide', 'cloud', 'multi-chain'] },

  // --- Cross-chain & Bridge ---
  { id: 'layerzero-bridge', name: 'LayerZero Bridge', author: 'LayerZero', category: 'Cross-chain', icon: 'https://img.icons8.com/fluency/96/layers.png', description: '全链互操作协议，跨链消息传递和资产桥接。', downloads: 58200, rating: 4.6, tags: ['bridge', 'omnichain', 'messaging'], featured: true },
  { id: 'wormhole-xfer', name: 'Wormhole Transfer', author: 'Wormhole', category: 'Cross-chain', icon: 'https://img.icons8.com/fluency/96/wormhole.png', description: '跨链资产转移和消息传递，支持20+区块链网络。', downloads: 45600, rating: 4.5, tags: ['bridge', 'cross-chain', 'transfer'] },
  { id: 'stargate-router', name: 'Stargate Router', author: 'Stargate', category: 'Cross-chain', icon: 'https://img.icons8.com/fluency/96/star-trek-symbol.png', description: '统一流动性跨链桥，原生资产跨链转移。', downloads: 38900, rating: 4.4, tags: ['bridge', 'liquidity', 'unified'] },
  { id: 'axelar-network', name: 'Axelar Network', author: 'Axelar', category: 'Cross-chain', icon: 'https://img.icons8.com/fluency/96/network.png', description: '安全跨链通信网络，GMP和Interchain服务。', downloads: 32100, rating: 4.3, tags: ['interchain', 'gmp', 'security'] },
  { id: 'ccip-chainlink', name: 'Chainlink CCIP', author: 'Chainlink', category: 'Cross-chain', icon: 'https://img.icons8.com/fluency/96/link.png', description: 'Chainlink跨链互操作协议，安全跨链Token转移和消息。', downloads: 28500, rating: 4.4, tags: ['ccip', 'chainlink', 'interop'] },
  { id: 'hyperlane-bridge', name: 'Hyperlane Messaging', author: 'Hyperlane', category: 'Cross-chain', icon: 'https://img.icons8.com/fluency/96/internet.png', description: '模块化跨链消息协议，Permissionless部署、自定义安全模型和Warp Route资产桥。', downloads: 21800, rating: 4.3, tags: ['messaging', 'modular', 'permissionless'] },
  { id: 'debridge', name: 'deBridge Cross-chain', author: 'deBridge', category: 'Cross-chain', icon: 'https://img.icons8.com/fluency/96/electrical.png', description: 'deBridge高速跨链协议，DLN限价跨链交易、去中心化验证和即时结算。', downloads: 25600, rating: 4.4, tags: ['fast-bridge', 'dln', 'settlement'] },
  { id: 'circle-cctp', name: 'Circle CCTP', author: 'Circle', category: 'Cross-chain', icon: 'https://img.icons8.com/fluency/96/circle.png', description: 'Circle跨链USDC传输协议，原生USDC跨链销毁铸造，无需包装代币。', downloads: 34200, rating: 4.5, tags: ['usdc', 'native-bridge', 'burn-mint'] },
];

// 提取分类
const categories = [...new Set(skillsData.map(s => s.category))];

// API: 获取所有分类
app.get('/api/categories', (req, res) => {
  const cats = categories.map(cat => {
    const skills = skillsData.filter(s => s.category === cat);
    return {
      name: cat,
      count: skills.length,
      totalDownloads: skills.reduce((sum, s) => sum + s.downloads, 0)
    };
  });
  res.json({ categories: cats });
});

// API: 获取skills列表
app.get('/api/skills', (req, res) => {
  let { category, sort, dir, search, page, limit } = req.query;
  let filtered = [...skillsData];

  if (category && category !== 'all') {
    filtered = filtered.filter(s => s.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some(t => t.includes(q)) ||
      s.author.toLowerCase().includes(q)
    );
  }

  // Sort
  sort = sort || 'downloads';
  dir = dir || 'desc';
  filtered.sort((a, b) => {
    const va = a[sort] || 0;
    const vb = b[sort] || 0;
    return dir === 'desc' ? vb - va : va - vb;
  });

  // Featured first if no specific sort
  if (!req.query.sort) {
    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  const total = filtered.length;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 50;
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  res.json({ skills: items, total, page, limit });
});

// API: 获取单个skill详情
app.get('/api/skills/:id', (req, res) => {
  const skill = skillsData.find(s => s.id === req.params.id);
  if (!skill) return res.status(404).json({ error: 'Skill not found' });

  // 增强详情信息
  const detail = {
    ...skill,
    version: '1.0.' + Math.floor(skill.downloads / 10000),
    lastUpdated: '2026-03-' + String(Math.min(13, Math.floor(Math.random() * 13) + 1)).padStart(2, '0'),
    size: (Math.random() * 5 + 0.5).toFixed(1) + ' MB',
    compatibility: ['Claude Code', 'ClawHub'],
    screenshots: [],
    changelog: `v1.0 - 初始版本发布\nv1.1 - 性能优化和Bug修复\nv1.2 - 新增功能和API支持`,
    requirements: '需要有效的API密钥和钱包连接',
    relatedSkills: skillsData
      .filter(s => s.category === skill.category && s.id !== skill.id)
      .slice(0, 4)
      .map(s => ({ id: s.id, name: s.name, icon: s.icon, downloads: s.downloads }))
  };

  res.json(detail);
});

// API: 获取精选skills
app.get('/api/featured', (req, res) => {
  const featured = skillsData.filter(s => s.featured);
  res.json({ skills: featured });
});

// API: 图片代理
app.get('/api/proxy-image', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Missing url');
  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(5000)
    });
    if (!resp.ok) throw new Error('Failed');
    const ct = resp.headers.get('content-type') || 'image/png';
    res.setHeader('Content-Type', ct);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    const buf = Buffer.from(await resp.arrayBuffer());
    res.send(buf);
  } catch {
    res.status(502).send('Proxy error');
  }
});

// Fallback: serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Skills Store running on port ${PORT}`);
});
