const express = require('express');
const cors = require('cors');
const path = require('path');
const archiver = require('archiver');
const fs = require('fs');
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

  // --- Meme & Launchpad ---
  { id: 'pump-fun', name: 'Pump.fun Launcher', author: 'Pump.fun', category: 'Meme & Launchpad', icon: 'https://img.icons8.com/fluency/96/launched-rocket.png', description: 'Solana最火Meme币发射平台，零代码一键发币、Bonding Curve自动定价、毕业迁移Raydium。', downloads: 186500, rating: 4.8, tags: ['meme', 'solana', 'launch'], featured: true },
  { id: 'moonshot-launcher', name: 'Moonshot DEX', author: 'Moonshot', category: 'Meme & Launchpad', icon: 'https://img.icons8.com/fluency/96/full-moon.png', description: 'Solana Meme币交易平台，信用卡直接购买Meme币、新币发现和趋势排行。', downloads: 132000, rating: 4.7, tags: ['meme', 'fiat', 'trading'], featured: true },
  { id: 'dextools-trending', name: 'DEXTools Trending', author: 'DEXTools', category: 'Meme & Launchpad', icon: 'https://img.icons8.com/fluency/96/fire-element.png', description: '热门代币趋势排行，实时新币监控、大单追踪和多链Hot Pairs榜单。', downloads: 145200, rating: 4.7, tags: ['trending', 'hot-pairs', 'multichain'], featured: true },
  { id: 'ave-fun', name: 'Ave.fun Launcher', author: 'Ave.ai', category: 'Meme & Launchpad', icon: 'https://img.icons8.com/fluency/96/rocket.png', description: 'AI智能Meme币发射，自动生成代币概念、Logo和社交媒体推广，多链支持。', downloads: 89300, rating: 4.5, tags: ['meme', 'ai-launch', 'multichain'] },
  { id: 'flap-sh', name: 'Flap.sh Launch', author: 'Flap', category: 'Meme & Launchpad', icon: 'https://img.icons8.com/fluency/96/paper-plane.png', description: '多链Meme代币创建和发射平台，SIWE验证、Portal合约和自定义Vanity地址。', downloads: 67200, rating: 4.4, tags: ['meme', 'multichain', 'vanity'] },
  { id: 'gempad-launch', name: 'GemPad Launchpad', author: 'GemPad', category: 'Meme & Launchpad', icon: 'https://img.icons8.com/fluency/96/diamond.png', description: '多链代币Launchpad，Fair Launch、Presale和代币锁定服务，支持10+链。', downloads: 58400, rating: 4.3, tags: ['launchpad', 'presale', 'lock'] },
  { id: 'pinksale', name: 'PinkSale Presale', author: 'PinkSale', category: 'Meme & Launchpad', icon: 'https://img.icons8.com/fluency/96/paint-bucket.png', description: '最大的去中心化预售平台，代币创建、Presale、Fair Launch和流动性锁定。', downloads: 76800, rating: 4.4, tags: ['presale', 'fairlaunch', 'lock'], featured: true },
  { id: 'defined-fi', name: 'Defined.fi Scanner', author: 'Defined', category: 'Meme & Launchpad', icon: 'https://img.icons8.com/fluency/96/zoom-in.png', description: '实时代币扫描和过滤，新池发现、Meme币筛选器和多链流动性追踪。', downloads: 71500, rating: 4.5, tags: ['scanner', 'filter', 'new-pool'] },
  { id: 'banana-gun', name: 'Banana Gun Sniper', author: 'Banana Gun', category: 'Meme & Launchpad', icon: 'https://img.icons8.com/fluency/96/banana.png', description: 'Telegram交易机器人，新币狙击、限价单和反Rug保护，支持ETH/SOL/Base。', downloads: 95600, rating: 4.6, tags: ['sniper', 'telegram-bot', 'trading'], featured: true },
  { id: 'maestro-bot', name: 'Maestro Trading Bot', author: 'Maestro', category: 'Meme & Launchpad', icon: 'https://img.icons8.com/fluency/96/musical-notes.png', description: 'Telegram链上交易机器人，多链Sniper、复制交易和钱包追踪，支持ETH/BSC/SOL。', downloads: 82100, rating: 4.5, tags: ['telegram-bot', 'sniper', 'copy-trade'] },
  { id: 'unibot', name: 'Unibot Trader', author: 'Unibot', category: 'Meme & Launchpad', icon: 'https://img.icons8.com/fluency/96/bot.png', description: 'Telegram快速交易机器人，新币狙击、限价单和Private TX保护。', downloads: 73400, rating: 4.4, tags: ['telegram-bot', 'fast-trade', 'private-tx'] },
  { id: 'sol-trending', name: 'SOL Trending Monitor', author: 'SolTools', category: 'Meme & Launchpad', icon: 'https://img.icons8.com/fluency/96/sun.png', description: 'Solana热门代币实时监控，新币追踪、Volume异动检测和Smart Money流入提醒。', downloads: 64800, rating: 4.4, tags: ['solana', 'trending', 'volume'] },

  // --- Airdrop & Earn ---
  { id: 'defi-airdrop', name: 'Airdrop Tracker', author: 'AirdropAlert', category: 'Airdrop & Earn', icon: 'https://img.icons8.com/fluency/96/parachute.png', description: '空投机会聚合追踪，确认空投和潜在空投项目列表、资格查询和领取教程。', downloads: 156000, rating: 4.7, tags: ['airdrop', 'tracker', 'claim'], featured: true },
  { id: 'earndrop', name: 'EarnDrop Auto', author: 'EarnDAO', category: 'Airdrop & Earn', icon: 'https://img.icons8.com/fluency/96/gift.png', description: '自动化空投交互工具，批量钱包管理、任务自动完成和链上活跃度维护。', downloads: 112300, rating: 4.5, tags: ['airdrop', 'automation', 'batch'], featured: true },
  { id: 'staking-rewards', name: 'Staking Rewards', author: 'StakingRewards', category: 'Airdrop & Earn', icon: 'https://img.icons8.com/fluency/96/gold-bars.png', description: '质押收益排行和计算器，200+资产的APY对比、最优质押方案推荐。', downloads: 98700, rating: 4.6, tags: ['staking', 'apy', 'calculator'], featured: true },
  { id: 'points-dashboard', name: 'Points Dashboard', author: 'PointsDAO', category: 'Airdrop & Earn', icon: 'https://img.icons8.com/fluency/96/scorecard.png', description: '积分系统仪表盘，追踪多协议积分累积、预估空投价值和最优积分策略。', downloads: 87500, rating: 4.5, tags: ['points', 'dashboard', 'estimate'] },
  { id: 'testnet-faucet', name: 'Testnet Faucet Hub', author: 'FaucetHub', category: 'Airdrop & Earn', icon: 'https://img.icons8.com/fluency/96/water-tap.png', description: '测试网水龙头聚合，一键领取多链测试代币、Testnet任务指引。', downloads: 76200, rating: 4.3, tags: ['testnet', 'faucet', 'free'] },
  { id: 'yield-aggregator', name: 'Yield Aggregator Pro', author: 'YieldMax', category: 'Airdrop & Earn', icon: 'https://img.icons8.com/fluency/96/money-bag.png', description: '全链DeFi收益聚合，自动寻找最高APY的Farm和Pool，一键存入最优策略。', downloads: 82100, rating: 4.5, tags: ['yield', 'farm', 'aggregator'] },
  { id: 'quest-aggregator', name: 'Quest Aggregator', author: 'QuestHub', category: 'Airdrop & Earn', icon: 'https://img.icons8.com/fluency/96/quest.png', description: '链上任务聚合平台，Galxe/Zealy/Layer3等多平台任务统一管理和自动提醒。', downloads: 69400, rating: 4.4, tags: ['quest', 'task', 'aggregator'] },
  { id: 'learn-to-earn', name: 'Learn-to-Earn Hub', author: 'CryptoEdu', category: 'Airdrop & Earn', icon: 'https://img.icons8.com/fluency/96/graduation-cap.png', description: '学习赚取奖励平台，完成加密知识课程获取代币奖励、链上认证和技能NFT。', downloads: 58300, rating: 4.3, tags: ['learn', 'earn', 'education'] },
  { id: 'referral-tracker', name: 'Referral Tracker', author: 'RefDAO', category: 'Airdrop & Earn', icon: 'https://img.icons8.com/fluency/96/share.png', description: '推荐奖励追踪系统，多协议Referral管理、佣金计算和邀请链接生成。', downloads: 45600, rating: 4.2, tags: ['referral', 'commission', 'invite'] },
  { id: 'liquidity-mining', name: 'LP Mining Optimizer', author: 'MineMax', category: 'Airdrop & Earn', icon: 'https://img.icons8.com/fluency/96/pickaxe.png', description: '流动性挖矿收益优化，无常损失计算、最优LP配对推荐和自动复利策略。', downloads: 53200, rating: 4.3, tags: ['lp-mining', 'il-calculator', 'compound'] },

  // --- DAO & Governance ---
  { id: 'tally-vote', name: 'Tally Governance', author: 'Tally', category: 'DAO & Governance', icon: 'https://img.icons8.com/fluency/96/parliament.png', description: '链上治理投票平台，提案浏览、投票参与、委托代理和治理数据分析。', downloads: 72300, rating: 4.6, tags: ['governance', 'vote', 'delegate'], featured: true },
  { id: 'aragon-dao', name: 'Aragon DAO Builder', author: 'Aragon', category: 'DAO & Governance', icon: 'https://img.icons8.com/fluency/96/organization.png', description: '一键创建DAO组织，投票机制配置、国库管理和成员权限控制。', downloads: 56800, rating: 4.5, tags: ['dao', 'create', 'treasury'], featured: true },
  { id: 'gnosis-safe-dao', name: 'Safe DAO Treasury', author: 'Safe', category: 'DAO & Governance', icon: 'https://img.icons8.com/fluency/96/safe.png', description: 'DAO国库多签管理，资金分配、预算提案和支出审批流程。', downloads: 63500, rating: 4.6, tags: ['treasury', 'multisig', 'budget'] },
  { id: 'coordinape', name: 'Coordinape Rewards', author: 'Coordinape', category: 'DAO & Governance', icon: 'https://img.icons8.com/fluency/96/handshake.png', description: 'DAO贡献者奖励分配工具，Peer Review评估、GIVE代币激励和薪酬管理。', downloads: 38200, rating: 4.3, tags: ['rewards', 'contribution', 'compensation'] },
  { id: 'colony-dao', name: 'Colony DAO OS', author: 'Colony', category: 'DAO & Governance', icon: 'https://img.icons8.com/fluency/96/beehive.png', description: 'DAO操作系统，任务分配、声望系统、资金管理和自动化治理。', downloads: 28900, rating: 4.2, tags: ['dao-os', 'reputation', 'task'] },
  { id: 'boardroom', name: 'Boardroom Analytics', author: 'Boardroom', category: 'DAO & Governance', icon: 'https://img.icons8.com/fluency/96/meeting-room.png', description: '跨DAO治理数据聚合，提案追踪、投票分析和治理参与度排行。', downloads: 34500, rating: 4.3, tags: ['analytics', 'cross-dao', 'participation'] },
  { id: 'snapshot-plus', name: 'Snapshot Plus', author: 'Snapshot', category: 'DAO & Governance', icon: 'https://img.icons8.com/fluency/96/camera.png', description: 'Snapshot增强工具，批量投票、提案模板、投票提醒和代理委托管理。', downloads: 45600, rating: 4.4, tags: ['snapshot', 'batch-vote', 'delegation'] },
  { id: 'jokerace', name: 'JokeRace Contests', author: 'JokeRace', category: 'DAO & Governance', icon: 'https://img.icons8.com/fluency/96/medal.png', description: '链上竞赛和投票平台，社区提案评选、赏金分配和排名投票。', downloads: 22100, rating: 4.1, tags: ['contest', 'ranking', 'bounty'] },

  // --- Payment & Commerce ---
  { id: 'request-network', name: 'Request Network Pay', author: 'Request', category: 'Payment & Commerce', icon: 'https://img.icons8.com/fluency/96/invoice.png', description: '加密支付和发票系统，创建和发送加密货币发票、自动化会计和税务报告。', downloads: 67800, rating: 4.5, tags: ['payment', 'invoice', 'accounting'], featured: true },
  { id: 'superfluid-stream', name: 'Superfluid Streams', author: 'Superfluid', category: 'Payment & Commerce', icon: 'https://img.icons8.com/fluency/96/river.png', description: '实时代币流支付，按秒工资发放、订阅付费和持续分红。', downloads: 52300, rating: 4.5, tags: ['stream', 'salary', 'subscription'], featured: true },
  { id: 'sablier-vesting', name: 'Sablier Vesting', author: 'Sablier', category: 'Payment & Commerce', icon: 'https://img.icons8.com/fluency/96/time.png', description: '代币线性释放和归属计划，员工Token Vesting、投资者锁仓和定时分发。', downloads: 41200, rating: 4.4, tags: ['vesting', 'lock', 'linear-release'] },
  { id: 'coinbase-commerce', name: 'Coinbase Commerce', author: 'Coinbase', category: 'Payment & Commerce', icon: 'https://img.icons8.com/fluency/96/shopping-cart.png', description: '商户加密支付接入，支持BTC/ETH/USDC等主流币种收款，Webhook通知和订单管理。', downloads: 89500, rating: 4.6, tags: ['merchant', 'payment', 'checkout'], featured: true },
  { id: 'gnosis-pay', name: 'Gnosis Pay Card', author: 'Gnosis', category: 'Payment & Commerce', icon: 'https://img.icons8.com/fluency/96/bank-card-front-side.png', description: '加密Visa借记卡管理，链上余额直接消费、消费记录追踪和自动换汇。', downloads: 58400, rating: 4.4, tags: ['card', 'visa', 'spend'] },
  { id: 'utopia-payroll', name: 'Utopia Payroll', author: 'Utopia Labs', category: 'Payment & Commerce', icon: 'https://img.icons8.com/fluency/96/money-transfer.png', description: 'DAO和团队加密薪资管理，批量发放、多币种工资和税务合规。', downloads: 35600, rating: 4.3, tags: ['payroll', 'batch', 'compliance'] },
  { id: 'slash-pay', name: 'Slash Web3 Payment', author: 'Slash', category: 'Payment & Commerce', icon: 'https://img.icons8.com/fluency/96/qr-code.png', description: 'Web3支付网关，二维码收款、多链多币种结算和商户后台管理。', downloads: 42100, rating: 4.3, tags: ['gateway', 'qr-code', 'settlement'] },
  { id: 'spruce-id', name: 'Spruce DID Identity', author: 'Spruce', category: 'Payment & Commerce', icon: 'https://img.icons8.com/fluency/96/identification-documents.png', description: '去中心化身份验证，DID创建、可验证凭证签发和SIWE登录集成。', downloads: 31500, rating: 4.2, tags: ['did', 'identity', 'siwe'] },

  // --- Research & Education ---
  { id: 'crypto-glossary', name: 'Crypto Glossary AI', author: 'CryptoEdu', category: 'Research & Education', icon: 'https://img.icons8.com/fluency/96/book.png', description: 'AI加密术语百科，输入任何Web3概念即刻获得中英文解释、案例和相关项目。', downloads: 125000, rating: 4.7, tags: ['glossary', 'education', 'ai'], featured: true },
  { id: 'whitepaper-reader', name: 'Whitepaper Reader AI', author: 'PaperAI', category: 'Research & Education', icon: 'https://img.icons8.com/fluency/96/document.png', description: 'AI白皮书阅读助手，一键总结项目白皮书、提取关键信息和风险提示。', downloads: 89200, rating: 4.6, tags: ['whitepaper', 'summary', 'analysis'], featured: true },
  { id: 'tokenomics-analyzer', name: 'Tokenomics Analyzer', author: 'TokenLab', category: 'Research & Education', icon: 'https://img.icons8.com/fluency/96/pie-chart.png', description: '代币经济模型分析器，解读Vesting计划、通胀率、代币分配和解锁时间线。', downloads: 72400, rating: 4.5, tags: ['tokenomics', 'vesting', 'unlock'] },
  { id: 'vc-tracker', name: 'VC Investment Tracker', author: 'FundWatch', category: 'Research & Education', icon: 'https://img.icons8.com/fluency/96/briefcase.png', description: '顶级VC投资追踪，a16z/Paradigm/Binance Labs等机构最新投资动态和Portfolio分析。', downloads: 68500, rating: 4.5, tags: ['vc', 'investment', 'portfolio'], featured: true },
  { id: 'on-chain-alpha', name: 'On-Chain Alpha Finder', author: 'AlphaDAO', category: 'Research & Education', icon: 'https://img.icons8.com/fluency/96/treasure-chest.png', description: '链上Alpha信号发现，早期项目识别、Smart Money新买入追踪和叙事轮动预判。', downloads: 95600, rating: 4.7, tags: ['alpha', 'early-bird', 'narrative'], featured: true },
  { id: 'crypto-calendar', name: 'Crypto Event Calendar', author: 'EventDAO', category: 'Research & Education', icon: 'https://img.icons8.com/fluency/96/calendar.png', description: '加密行业日历，代币解锁、主网上线、AMA活动和会议时间线。', downloads: 78300, rating: 4.4, tags: ['calendar', 'unlock', 'events'] },
  { id: 'fear-greed-index', name: 'Fear & Greed Index', author: 'Alternative.me', category: 'Research & Education', icon: 'https://img.icons8.com/fluency/96/dashboard-layout.png', description: '加密恐惧贪婪指数，实时市场情绪追踪、历史数据对比和交易信号。', downloads: 105000, rating: 4.6, tags: ['sentiment', 'index', 'market'] },
  { id: 'funding-rate', name: 'Funding Rate Monitor', author: 'RateLab', category: 'Research & Education', icon: 'https://img.icons8.com/fluency/96/percentage.png', description: '永续合约资金费率监控，多交易所对比、套利机会发现和费率历史分析。', downloads: 62100, rating: 4.4, tags: ['funding-rate', 'arbitrage', 'perp'] },
  { id: 'unlock-schedule', name: 'Token Unlock Schedule', author: 'TokenUnlocks', category: 'Research & Education', icon: 'https://img.icons8.com/fluency/96/unlock.png', description: '代币解锁日程追踪，项目Token释放时间、解锁金额和对价格影响分析。', downloads: 84700, rating: 4.5, tags: ['unlock', 'vesting', 'schedule'] },
  { id: 'rugcheck', name: 'RugCheck Scanner', author: 'RugCheck', category: 'Research & Education', icon: 'https://img.icons8.com/fluency/96/detective.png', description: '代币安全快速检测，Rug Pull风险评分、流动性锁定验证和合约权限检查。', downloads: 118000, rating: 4.7, tags: ['rug-check', 'safety', 'scan'], featured: true },

  // --- General / Popular ---
  { id: 'gen-web-search', name: 'Web Search Pro', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/search.png', description: '智能网络搜索，实时获取最新信息，支持多引擎聚合、结果摘要和来源引用。适用于研究、新闻和事实核查。', downloads: 245000, rating: 4.9, tags: ['search', 'web', 'information'], featured: true },
  { id: 'gen-summarizer', name: 'AI Summarizer', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/summary-list.png', description: '一键总结长文档、网页和PDF，提取关键要点、生成结构化摘要，支持中英文双语输出。', downloads: 218000, rating: 4.9, tags: ['summarize', 'text', 'ai'], featured: true },
  { id: 'gen-code-assistant', name: 'Code Assistant', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/source-code.png', description: '全能编程助手，支持50+语言代码生成、解释、调试、重构和优化。集成最佳实践和设计模式建议。', downloads: 312000, rating: 4.9, tags: ['coding', 'programming', 'debug'], featured: true },
  { id: 'gen-note-taker', name: 'Smart Note Taker', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/note.png', description: '智能笔记记录与管理，自动整理、标签分类、全文搜索，支持Markdown和富文本格式。', downloads: 187000, rating: 4.8, tags: ['notes', 'organize', 'markdown'], featured: true },
  { id: 'gen-task-manager', name: 'Task Manager AI', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/task-planning.png', description: 'AI驱动的任务管理工具，自动拆解目标为可执行步骤、优先级排序、进度追踪和提醒通知。', downloads: 165000, rating: 4.8, tags: ['tasks', 'productivity', 'planning'], featured: true },
  { id: 'gen-translator', name: 'Universal Translator', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/translate.png', description: '支持200+语言的高精度翻译工具，上下文感知翻译、专业术语处理和文化适配，保留原文语气和风格。', downloads: 289000, rating: 4.8, tags: ['translate', 'language', 'multilingual'], featured: true },
  { id: 'gen-writer', name: 'AI Writing Assistant', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/quill-with-ink.png', description: '全场景写作助手，文章、邮件、报告、广告文案一键生成，支持多种风格和语调调整。', downloads: 198000, rating: 4.8, tags: ['writing', 'content', 'copywriting'], featured: true },
  { id: 'gen-pdf-reader', name: 'PDF Reader & Analyzer', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/pdf.png', description: 'PDF智能阅读和分析工具，提取文本、解析表格、问答交互，支持扫描件OCR识别和批量处理。', downloads: 156000, rating: 4.7, tags: ['pdf', 'ocr', 'document'] },
  { id: 'gen-image-gen', name: 'Image Generator', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/image.png', description: 'AI图像生成工具，文字转图像、风格迁移、图像编辑和增强，支持多种艺术风格和分辨率。', downloads: 223000, rating: 4.8, tags: ['image', 'ai-art', 'generate'] },
  { id: 'gen-calendar-ai', name: 'Calendar AI', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/calendar.png', description: '智能日历助手，自然语言创建事件、会议安排优化、时区转换和提醒管理，与主流日历同步。', downloads: 134000, rating: 4.7, tags: ['calendar', 'schedule', 'meeting'] },
  { id: 'gen-email-writer', name: 'Email Writer Pro', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/email.png', description: '专业邮件写作助手，根据场景自动生成正式/非正式邮件，支持回复建议、主题优化和多语言。', downloads: 142000, rating: 4.7, tags: ['email', 'communication', 'business'] },
  { id: 'gen-data-analyzer', name: 'Data Analyzer', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/chart.png', description: '数据分析和可视化工具，上传CSV/Excel自动生成图表、统计摘要、趋势分析和洞察报告。', downloads: 178000, rating: 4.8, tags: ['data', 'analytics', 'visualization'] },
  { id: 'gen-file-converter', name: 'File Format Converter', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/file-transfer.png', description: '多格式文件转换工具，支持PDF/Word/Excel/PPT/图片等200+格式互转，批量处理，保留原始格式。', downloads: 119000, rating: 4.6, tags: ['convert', 'file', 'format'] },
  { id: 'gen-browser-agent', name: 'Browser Agent', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/internet-explorer.png', description: '自动化浏览器操作，网页抓取、表单填写、截图、数据提取和自动化测试，支持复杂工作流。', downloads: 145000, rating: 4.7, tags: ['browser', 'automation', 'scraping'] },
  { id: 'gen-clipboard-manager', name: 'Clipboard Manager', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/clipboard.png', description: '智能剪贴板管理，历史记录搜索、常用片段保存、跨设备同步和自动格式化，提升复制粘贴效率。', downloads: 98000, rating: 4.6, tags: ['clipboard', 'snippets', 'productivity'] },
  { id: 'gen-mindmap', name: 'Mind Map Creator', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/mind-map.png', description: 'AI辅助思维导图工具，一键扩展节点、自动布局、多格式导出，支持团队协作和版本历史。', downloads: 112000, rating: 4.7, tags: ['mindmap', 'brainstorm', 'visual'] },
  { id: 'gen-meeting-notes', name: 'Meeting Notes AI', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/meeting.png', description: '会议记录自动化，实时转录、关键点提取、行动项追踪和会议摘要生成，支持多种语言。', downloads: 125000, rating: 4.7, tags: ['meeting', 'transcribe', 'notes'] },
  { id: 'gen-password-gen', name: 'Password Generator', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/password.png', description: '安全密码生成和管理工具，自定义规则生成强密码、安全评估、加密存储和自动填充。', downloads: 87000, rating: 4.6, tags: ['password', 'security', 'generator'] },
  { id: 'gen-regex-helper', name: 'Regex Helper', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/regex.png', description: '正则表达式生成和调试工具，自然语言描述自动生成正则、实时测试、常用模式库和详细解释。', downloads: 93000, rating: 4.7, tags: ['regex', 'pattern', 'text'] },
  { id: 'gen-color-palette', name: 'Color Palette Generator', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/color-palette.png', description: '智能配色方案生成，品牌色彩提取、和谐配色算法、无障碍对比度检测和设计系统导出。', downloads: 76000, rating: 4.6, tags: ['color', 'design', 'palette'] },
  { id: 'gen-json-tool', name: 'JSON Toolkit', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/json.png', description: 'JSON格式化、验证、转换和查询工具，支持JSONPath、Schema验证、类型生成和多格式互转。', downloads: 134000, rating: 4.8, tags: ['json', 'format', 'validate'] },
  { id: 'gen-markdown-editor', name: 'Markdown Editor Pro', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/markdown.png', description: '专业Markdown编辑器，实时预览、扩展语法支持、模板库、一键导出HTML/PDF/Word。', downloads: 108000, rating: 4.7, tags: ['markdown', 'editor', 'writing'] },
  { id: 'gen-screenshot-tool', name: 'Screenshot & Annotate', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/screenshot.png', description: '截图和标注工具，全屏/区域/滚动截图、画笔标注、箭头高亮、文字注释和一键分享。', downloads: 89000, rating: 4.6, tags: ['screenshot', 'annotate', 'capture'] },
  { id: 'gen-time-tracker', name: 'Time Tracker Pro', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/time.png', description: '专业时间追踪工具，项目计时、自动分类、工作报告生成和效率分析，支持团队协作。', downloads: 95000, rating: 4.6, tags: ['time', 'tracking', 'productivity'] },
  { id: 'gen-api-tester', name: 'API Tester', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/api.png', description: 'REST/GraphQL API测试工具，请求构建、环境变量管理、自动化测试脚本、响应可视化和团队协作。', downloads: 167000, rating: 4.8, tags: ['api', 'testing', 'rest'] },
  { id: 'gen-git-helper', name: 'Git Helper', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/git.png', description: 'Git操作助手，自动生成提交信息、代码Review、分支管理建议、冲突解决和工作流优化。', downloads: 189000, rating: 4.8, tags: ['git', 'version-control', 'commit'] },
  { id: 'gen-sql-assistant', name: 'SQL Assistant', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/database.png', description: 'SQL查询生成和优化工具，自然语言转SQL、查询优化建议、执行计划分析和数据库文档生成。', downloads: 145000, rating: 4.8, tags: ['sql', 'database', 'query'] },
  { id: 'gen-resume-builder', name: 'Resume Builder AI', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/resume.png', description: 'AI简历生成器，根据职位描述优化简历内容、ATS关键词匹配、专业模板和多格式导出。', downloads: 132000, rating: 4.7, tags: ['resume', 'career', 'ai'] },
  { id: 'gen-presentation', name: 'Presentation Maker', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/presentation.png', description: 'AI幻灯片生成工具，从大纲自动创建演示文稿、智能排版、图表生成和主题定制，导出PPT/PDF。', downloads: 156000, rating: 4.7, tags: ['presentation', 'slides', 'powerpoint'] },
  { id: 'gen-spreadsheet-ai', name: 'Spreadsheet AI', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/ms-excel.png', description: '表格数据智能处理，自动公式生成、数据清洗、透视表创建和异常检测，兼容Excel/Google Sheets。', downloads: 143000, rating: 4.7, tags: ['spreadsheet', 'excel', 'data'] },
  { id: 'gen-code-review', name: 'Code Review Bot', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/code-review.png', description: '自动化代码审查工具，安全漏洞检测、代码规范检查、性能优化建议和重构指导，支持GitHub集成。', downloads: 178000, rating: 4.8, tags: ['code-review', 'security', 'quality'] },
  { id: 'gen-docker-helper', name: 'Docker Helper', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/docker.png', description: 'Docker容器管理助手，Dockerfile生成、compose配置优化、镜像分析、安全扫描和部署建议。', downloads: 134000, rating: 4.7, tags: ['docker', 'container', 'devops'] },
  { id: 'gen-linux-terminal', name: 'Linux Terminal AI', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/console.png', description: 'Linux命令行助手，命令生成和解释、Shell脚本编写、错误诊断和系统管理自动化。', downloads: 167000, rating: 4.8, tags: ['linux', 'shell', 'terminal'] },
  { id: 'gen-unit-tester', name: 'Unit Test Generator', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/test-passed.png', description: '自动单元测试生成，覆盖边界条件、Mock生成、测试报告分析和覆盖率优化，支持主流测试框架。', downloads: 123000, rating: 4.7, tags: ['testing', 'unit-test', 'coverage'] },
  { id: 'gen-diagram-maker', name: 'Diagram Maker', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/workflow.png', description: '专业流程图和架构图绘制，自然语言生成图表、UML/ER图支持、团队协作和多格式导出。', downloads: 115000, rating: 4.7, tags: ['diagram', 'flowchart', 'uml'] },
  { id: 'gen-calculator', name: 'Scientific Calculator', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/calculator.png', description: '科学计算器，支持复杂数学表达式、单位换算、统计计算、公式推导和计算步骤详解。', downloads: 78000, rating: 4.6, tags: ['calculator', 'math', 'science'] },
  { id: 'gen-qr-generator', name: 'QR Code Generator', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/qr-code.png', description: '多功能二维码生成器，URL/名片/WiFi/文本等多种内容格式，自定义颜色、Logo嵌入和批量生成。', downloads: 82000, rating: 4.6, tags: ['qr-code', 'barcode', 'generator'] },
  { id: 'gen-text-formatter', name: 'Text Formatter', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/text.png', description: '文本格式化和处理工具，大小写转换、去重去空白、提取关键词、词频统计和批量文本操作。', downloads: 67000, rating: 4.5, tags: ['text', 'format', 'process'] },
  { id: 'gen-url-shortener', name: 'URL Shortener & Tracker', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/link.png', description: '短链接生成和追踪工具，自定义域名、点击统计、地域分析和UTM参数管理。', downloads: 58000, rating: 4.5, tags: ['url', 'shortener', 'analytics'] },
  { id: 'gen-grammar-check', name: 'Grammar Checker Pro', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/spellcheck.png', description: '高级语法和拼写检查，风格建议、可读性评分、学术写作优化，支持中英文和多种语言。', downloads: 145000, rating: 4.7, tags: ['grammar', 'writing', 'proofreading'] },
  { id: 'gen-voice-transcribe', name: 'Voice Transcriber', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/microphone.png', description: '语音转文字工具，支持50+语言实时转录、会议录音处理、说话人分离和字幕生成。', downloads: 123000, rating: 4.7, tags: ['voice', 'transcribe', 'speech'] },
  { id: 'gen-backup-sync', name: 'Backup & Sync', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/sync.png', description: '文件备份和同步工具，自动备份规则、版本历史、增量同步和跨云存储管理（S3/OSS/GCS）。', downloads: 72000, rating: 4.6, tags: ['backup', 'sync', 'cloud'] },
  { id: 'gen-env-manager', name: 'Environment Manager', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/settings.png', description: '开发环境变量管理，.env文件加密存储、团队共享、多环境切换和敏感信息安全审计。', downloads: 89000, rating: 4.6, tags: ['env', 'secrets', 'devops'] },
  { id: 'gen-log-analyzer', name: 'Log Analyzer', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/log.png', description: '日志分析和监控工具，异常模式识别、错误聚合、性能瓶颈定位和告警规则配置。', downloads: 95000, rating: 4.7, tags: ['logs', 'monitoring', 'debug'] },
  { id: 'gen-ip-tools', name: 'IP & Network Tools', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/network.png', description: 'IP查询和网络诊断工具集，地理位置、WHOIS、DNS解析、端口扫描、延迟测试和路由追踪。', downloads: 63000, rating: 4.5, tags: ['ip', 'network', 'dns'] },
  { id: 'gen-cron-builder', name: 'Cron Expression Builder', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/clock.png', description: 'Cron表达式可视化编辑器，人性化界面生成复杂定时任务、下次执行时间预览和常用模板库。', downloads: 54000, rating: 4.5, tags: ['cron', 'scheduler', 'automation'] },
  { id: 'gen-css-generator', name: 'CSS Generator', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/css3.png', description: 'CSS效果生成器，渐变、阴影、动画、Flexbox/Grid布局可视化编辑，实时预览和代码输出。', downloads: 86000, rating: 4.6, tags: ['css', 'design', 'frontend'] },
  { id: 'gen-interview-prep', name: 'Interview Prep Coach', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/interview.png', description: 'AI面试准备教练，行为面试STAR法则练习、技术题目讲解、答案优化和模拟面试训练。', downloads: 118000, rating: 4.7, tags: ['interview', 'career', 'learning'] },
  { id: 'gen-learning-path', name: 'Learning Path Planner', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/road.png', description: '个性化学习路径规划，技能评估、课程推荐、学习计划生成和进度追踪，覆盖编程到商业。', downloads: 102000, rating: 4.7, tags: ['learning', 'education', 'skills'] },
  { id: 'gen-budget-tracker', name: 'Budget Tracker', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/money.png', description: '个人和团队预算管理，收支记录、分类统计、预算预警、财务报表和趋势分析。', downloads: 88000, rating: 4.6, tags: ['budget', 'finance', 'tracker'] },
  { id: 'gen-habit-tracker', name: 'Habit Tracker', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/target.png', description: '习惯养成追踪工具，打卡记录、连续天数统计、提醒通知、数据可视化和激励反馈系统。', downloads: 76000, rating: 4.6, tags: ['habits', 'productivity', 'wellness'] },
  { id: 'gen-recipe-ai', name: 'Recipe AI', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/chef-hat.png', description: '智能食谱助手，根据食材推荐菜谱、营养分析、购物清单生成和个性化饮食计划定制。', downloads: 65000, rating: 4.5, tags: ['recipe', 'food', 'nutrition'] },
  { id: 'gen-travel-planner', name: 'Travel Planner AI', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/airplane-take-off.png', description: 'AI旅行规划助手，行程设计、景点推荐、交通住宿建议、预算估算和离线地图导出。', downloads: 93000, rating: 4.6, tags: ['travel', 'planning', 'itinerary'] },
  { id: 'gen-language-tutor', name: 'Language Tutor AI', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/language.png', description: 'AI语言学习助手，发音纠正、词汇卡片、情景对话练习、语法讲解和自适应难度调整。', downloads: 112000, rating: 4.7, tags: ['language', 'learning', 'tutor'] },
  { id: 'gen-content-calendar', name: 'Content Calendar', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/planner.png', description: '内容营销日历工具，发布计划管理、多平台内容协调、AI内容建议和效果数据追踪。', downloads: 78000, rating: 4.6, tags: ['content', 'marketing', 'calendar'] },
  { id: 'gen-social-post', name: 'Social Post Generator', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/instagram.png', description: '社交媒体内容生成器，针对Twitter/LinkedIn/小红书/微博等平台优化文案、话题标签和最佳发布时间。', downloads: 134000, rating: 4.7, tags: ['social-media', 'content', 'marketing'] },
  { id: 'gen-seo-tools', name: 'SEO Toolkit', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/seo.png', description: 'SEO分析和优化工具集，关键词研究、竞争对手分析、内容优化建议、外链检查和排名追踪。', downloads: 98000, rating: 4.7, tags: ['seo', 'marketing', 'keywords'] },
  { id: 'gen-invoice-gen', name: 'Invoice Generator', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/invoice.png', description: '专业发票生成工具，自定义模板、自动编号、税率计算、多币种支持和PDF/邮件发送。', downloads: 82000, rating: 4.6, tags: ['invoice', 'business', 'finance'] },
  { id: 'gen-contract-drafter', name: 'Contract Drafter AI', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/contract.png', description: 'AI合同起草和审查工具，标准条款库、风险条款识别、法律合规检查和多语言合同生成。', downloads: 75000, rating: 4.6, tags: ['contract', 'legal', 'document'] },
  { id: 'gen-chart-builder', name: 'Chart Builder', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/combo-chart.png', description: '数据可视化图表构建，支持20+图表类型、交互式配置、动画效果和嵌入代码导出。', downloads: 105000, rating: 4.7, tags: ['charts', 'visualization', 'data'] },
  { id: 'gen-mock-data', name: 'Mock Data Generator', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/test.png', description: '测试数据生成工具，按Schema批量生成真实感数据，支持多种格式和自定义规则，API集成方便。', downloads: 89000, rating: 4.6, tags: ['mock', 'testing', 'data'] },
  { id: 'gen-webhook-tester', name: 'Webhook Tester', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/webhook.png', description: 'Webhook接收和调试工具，临时端点生成、请求记录、格式化展示和重放功能，无需服务器。', downloads: 67000, rating: 4.6, tags: ['webhook', 'api', 'debug'] },
  { id: 'gen-base64-tool', name: 'Encoder/Decoder Suite', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/encode.png', description: '编码解码工具集，Base64/URL/HTML/JWT/Hash等多种格式，批量处理和实时转换。', downloads: 72000, rating: 4.5, tags: ['encode', 'decode', 'base64'] },
  { id: 'gen-diff-tool', name: 'Text Diff Tool', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/difference.png', description: '文本差异对比工具，行级/字符级Diff显示、合并建议、代码对比和HTML/PDF导出。', downloads: 58000, rating: 4.5, tags: ['diff', 'compare', 'merge'] },
  { id: 'gen-font-tool', name: 'Font Finder & Pairing', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/font.png', description: '字体识别和搭配工具，图片字体识别、Google Fonts搜索、字体配对建议和网页嵌入代码。', downloads: 43000, rating: 4.4, tags: ['font', 'design', 'typography'] },
  { id: 'gen-icon-finder', name: 'Icon Finder Pro', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/icons8-new-logo.png', description: '图标搜索和管理工具，聚合主流图标库（Heroicons/Lucide/FontAwesome），SVG下载和项目管理。', downloads: 87000, rating: 4.6, tags: ['icons', 'design', 'svg'] },
  { id: 'gen-pomodoro', name: 'Pomodoro Timer Pro', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/tomato.png', description: '番茄工作法计时器，自定义专注/休息时长、统计报告、任务关联和白噪音背景音效。', downloads: 65000, rating: 4.5, tags: ['pomodoro', 'focus', 'productivity'] },
  { id: 'gen-world-clock', name: 'World Clock & Timezone', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/world.png', description: '全球时区工具，多城市时钟显示、会议时间转换、夏令时提醒和最佳会议时间推荐。', downloads: 48000, rating: 4.5, tags: ['timezone', 'clock', 'meeting'] },
  { id: 'gen-currency-conv', name: 'Currency Converter Pro', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/currency-exchange.png', description: '实时汇率货币转换，支持170+法币和加密货币，历史汇率图表、旅行货币计算和价格提醒。', downloads: 98000, rating: 4.6, tags: ['currency', 'exchange-rate', 'finance'] },
  { id: 'gen-read-later', name: 'Read Later & Highlights', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/bookmark.png', description: '稍后阅读和高亮工具，网页/文章保存、关键段落标注、AI摘要和智能推荐阅读队列管理。', downloads: 73000, rating: 4.6, tags: ['read-later', 'bookmarks', 'highlights'] },
  { id: 'gen-flashcards', name: 'Flashcard AI', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/flashcard.png', description: 'AI闪卡学习系统，从文档自动生成闪卡、间隔重复算法、语音朗读和多终端同步。', downloads: 68000, rating: 4.6, tags: ['flashcards', 'learning', 'memory'] },
  { id: 'gen-vpn-checker', name: 'Network Privacy Checker', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/privacy.png', description: '网络隐私和安全检测工具，IP泄露测试、DNS泄露检查、WebRTC泄露检测和隐私评分报告。', downloads: 52000, rating: 4.5, tags: ['privacy', 'security', 'network'] },
  { id: 'gen-website-monitor', name: 'Website Monitor', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/monitor.png', description: '网站可用性监控工具，HTTP状态检查、响应时间追踪、SSL证书到期提醒和故障告警通知。', downloads: 61000, rating: 4.5, tags: ['monitoring', 'uptime', 'website'] },
  { id: 'gen-batch-rename', name: 'Batch File Renamer', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/rename.png', description: '批量文件重命名工具，正则替换、序列编号、元数据重命名和预览确认，支持撤销操作。', downloads: 45000, rating: 4.4, tags: ['rename', 'files', 'batch'] },
  { id: 'gen-image-compress', name: 'Image Compressor', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/compress.png', description: '图片无损压缩和格式转换，WebP/AVIF优化、批量处理、保持EXIF信息和自定义质量设置。', downloads: 87000, rating: 4.6, tags: ['image', 'compress', 'optimize'] },
  { id: 'gen-video-downloader', name: 'Video Downloader', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/video.png', description: '在线视频下载工具，支持YouTube/Twitter/TikTok等1000+平台，多清晰度选择和字幕下载。', downloads: 154000, rating: 4.7, tags: ['video', 'download', 'media'] },
  { id: 'gen-ai-chatbot', name: 'Custom AI Chatbot', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/chatbot.png', description: '自定义AI聊天机器人构建器，导入文档知识库、角色设定、嵌入网站和多平台接入。', downloads: 198000, rating: 4.8, tags: ['chatbot', 'ai', 'knowledge-base'] },
  { id: 'gen-workflow-auto', name: 'Workflow Automation', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/bot.png', description: '无代码工作流自动化，触发器+动作模式连接500+应用，类Zapier功能，支持复杂条件和循环。', downloads: 175000, rating: 4.8, tags: ['automation', 'workflow', 'no-code'] },
  { id: 'gen-form-builder', name: 'Form Builder Pro', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/form.png', description: '拖拽式表单构建器，条件逻辑、支付集成、数据导出和嵌入代码，响应式设计移动端友好。', downloads: 112000, rating: 4.7, tags: ['forms', 'survey', 'no-code'] },
  { id: 'gen-landing-page', name: 'Landing Page Builder', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/web.png', description: 'AI落地页生成器，从产品描述一键生成高转化率页面，A/B测试、分析集成和一键发布。', downloads: 98000, rating: 4.6, tags: ['landing-page', 'marketing', 'no-code'] },
  { id: 'gen-chatgpt-prompts', name: 'Prompt Library Pro', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/lightning-bolt.png', description: '精选AI提示词库，10000+专业场景提示模板，分类搜索、自定义变量和一键复制使用。', downloads: 267000, rating: 4.9, tags: ['prompts', 'ai', 'productivity'], featured: true },
  { id: 'gen-number-format', name: 'Number & Unit Converter', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/ruler.png', description: '全能数字和单位换算工具，长度/重量/温度/面积/体积等200+单位，支持科学计数法和自定义单位。', downloads: 54000, rating: 4.5, tags: ['converter', 'units', 'math'] },
  { id: 'gen-audio-editor', name: 'Audio Editor & Converter', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/audio-wave.png', description: '在线音频编辑和转换工具，剪切拼接、降噪、格式转换、音量调整和波形可视化。', downloads: 67000, rating: 4.5, tags: ['audio', 'edit', 'convert'] },
  { id: 'gen-stock-tracker', name: 'Stock Tracker', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/stock-market.png', description: '股票和ETF追踪工具，实时行情、自选股管理、技术指标分析、新闻聚合和持仓盈亏统计。', downloads: 115000, rating: 4.7, tags: ['stocks', 'investing', 'finance'] },
  { id: 'gen-news-aggregator', name: 'News Aggregator AI', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/news.png', description: 'AI新闻聚合和摘要工具，个性化话题订阅、多源对比、偏见检测和每日简报推送。', downloads: 132000, rating: 4.7, tags: ['news', 'aggregator', 'ai'] },
  { id: 'gen-personal-crm', name: 'Personal CRM', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/contacts.png', description: '个人人脉管理工具，联系人信息维护、互动记录、跟进提醒和关系网络可视化分析。', downloads: 58000, rating: 4.5, tags: ['crm', 'contacts', 'networking'] },
  { id: 'gen-smart-home', name: 'Smart Home Controller', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/smart-home.png', description: '智能家居控制面板，支持HomeKit/Google Home/Alexa，场景自动化、能耗监控和设备状态统一管理。', downloads: 48000, rating: 4.4, tags: ['smart-home', 'iot', 'automation'] },
  { id: 'gen-screenshot-ocr', name: 'Screenshot OCR', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/scan-text.png', description: '截图文字识别工具，一键提取图片文字、表格识别、数学公式识别和多语言支持。', downloads: 108000, rating: 4.7, tags: ['ocr', 'screenshot', 'text-extract'] },
  { id: 'gen-browser-ext', name: 'Browser Extension Builder', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/extension.png', description: 'Chrome/Firefox扩展开发助手，代码生成、调试指导、发布流程辅助和API文档参考。', downloads: 72000, rating: 4.6, tags: ['extension', 'browser', 'development'] },
  { id: 'gen-emoji-picker', name: 'Emoji & Symbol Picker', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/star-wars-r2d2.png', description: '表情符号和特殊字符工具，快速搜索、最近使用、皮肤色调选择和批量插入Unicode字符。', downloads: 45000, rating: 4.4, tags: ['emoji', 'unicode', 'symbols'] },
  { id: 'gen-placeholder-gen', name: 'Placeholder Generator', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/picture.png', description: '占位图片和内容生成，自定义尺寸/颜色/文字，Lorem Ipsum变体和假数据生成，开发调试必备。', downloads: 38000, rating: 4.4, tags: ['placeholder', 'mockup', 'development'] },
  { id: 'gen-spelling-bee', name: 'Vocabulary Builder', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/abc.png', description: '词汇量扩展工具，每日单词学习、联想记忆法、词根词缀分析和英语水平测评。', downloads: 62000, rating: 4.5, tags: ['vocabulary', 'english', 'learning'] },
  { id: 'gen-idea-generator', name: 'Idea Generator', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/idea.png', description: 'AI创意和头脑风暴工具，产品名称/域名/口号生成，SCAMPER创意技法辅助和概念组合探索。', downloads: 89000, rating: 4.6, tags: ['ideas', 'brainstorm', 'creativity'] },
  { id: 'gen-project-charter', name: 'Project Charter Generator', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/project-management.png', description: '项目章程和计划生成器，范围定义、里程碑规划、风险评估和干系人分析，导出Word/PDF。', downloads: 54000, rating: 4.5, tags: ['project', 'management', 'planning'] },
  { id: 'gen-clipboard-ai', name: 'AI Clipboard Enhancer', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/paste.png', description: '剪贴板AI增强，复制内容自动总结/翻译/格式化，智能感知内容类型并提供处理建议。', downloads: 93000, rating: 4.7, tags: ['clipboard', 'ai', 'productivity'] },
  { id: 'gen-system-prompt', name: 'System Prompt Builder', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/command-line.png', description: 'AI系统提示词设计器，角色定义、能力约束、输出格式规范和安全护栏，可视化编辑和测试。', downloads: 142000, rating: 4.8, tags: ['system-prompt', 'ai', 'engineering'] },
  { id: 'gen-webhook-builder', name: 'Webhook Builder', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/connection.png', description: '可视化Webhook配置工具，事件订阅管理、payload转换、重试策略和监控日志面板。', downloads: 61000, rating: 4.5, tags: ['webhook', 'integration', 'api'] },
  { id: 'gen-sitemap-gen', name: 'Sitemap Generator', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/sitemap.png', description: 'XML/HTML站点地图生成工具，自动爬取页面、优先级设置、更新频率配置和自动提交搜索引擎。', downloads: 43000, rating: 4.4, tags: ['sitemap', 'seo', 'website'] },
  { id: 'gen-code-formatter', name: 'Code Formatter & Linter', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/code.png', description: '代码格式化和规范检查，支持50+语言，Prettier/ESLint配置集成，团队规范统一和自动修复。', downloads: 156000, rating: 4.8, tags: ['formatter', 'linter', 'code-quality'] },
  { id: 'gen-oauth-debugger', name: 'OAuth Debugger', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/key.png', description: 'OAuth 2.0/OpenID Connect调试工具，授权流程可视化、Token解析、权限范围验证和集成测试。', downloads: 55000, rating: 4.5, tags: ['oauth', 'auth', 'security'] },
  { id: 'gen-smart-search', name: 'Semantic Search', author: 'ClawHub', category: 'General / Popular', icon: 'https://img.icons8.com/fluency/96/search.png', description: '语义搜索引擎，向量化本地文档库、自然语言查询、上下文理解和相关性排序，私有部署支持。', downloads: 108000, rating: 4.7, tags: ['search', 'semantic', 'ai'] },
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
  const version = '1.0.' + Math.floor(skill.downloads / 10000);
  const seedNum = skill.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const favCount = Math.floor(skill.downloads * (0.05 + (seedNum % 10) * 0.008));
  const securityPassed = (seedNum % 7) !== 0; // most pass, occasional pending

  // Generate a deterministic but varied file list based on skill id
  const baseFiles = ['SKILL.md', 'package.json', 'README.md'];
  const extraFileSets = [
    ['index.js', 'config.json', 'utils/helpers.js'],
    ['main.py', 'requirements.txt', 'src/core.py'],
    ['skill.ts', 'tsconfig.json', 'lib/api.ts', 'types/index.d.ts'],
    ['handler.js', 'schema.graphql', 'resolvers/index.js'],
    ['skill.go', 'go.mod', 'internal/client.go'],
    ['main.rs', 'Cargo.toml', 'src/lib.rs'],
    ['action.yml', 'src/index.js', 'src/utils.js', '.env.example'],
    ['skill.js', 'skill.css', 'assets/icon.svg', 'locales/en.json', 'locales/zh.json'],
  ];
  const fileSet = extraFileSets[seedNum % extraFileSets.length];
  const skillFiles = [...baseFiles, ...fileSet];

  const detail = {
    ...skill,
    version,
    lastUpdated: '2026-03-' + String(Math.min(17, Math.floor((seedNum % 17) + 1))).padStart(2, '0'),
    size: ((seedNum % 45 + 5) / 10).toFixed(1) + ' MB',
    compatibility: ['Claude Code', 'ClawHub'],
    screenshots: [],
    changelog: `v1.0 - 初始版本发布\nv1.1 - 性能优化和Bug修复\nv1.2 - 新增功能和API支持`,
    requirements: '需要有效的API密钥和钱包连接',
    files: skillFiles,
    securityScan: {
      status: securityPassed ? 'passed' : 'pending',
      scannedAt: securityPassed ? '2026-03-15' : null,
      threats: 0,
      warnings: securityPassed ? 0 : 1,
    },
    favorites: favCount,
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

// API: 下载skill为zip文件
app.get('/api/skills/:id/download', (req, res) => {
  const skill = skillsData.find(s => s.id === req.params.id);
  if (!skill) return res.status(404).json({ error: 'Skill not found' });

  const version = '1.0.' + Math.floor(skill.downloads / 10000);
  const zipName = `${skill.id}-v${version}.zip`;

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);

  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.on('error', (err) => {
    console.error('Archive error:', err);
    if (!res.headersSent) res.status(500).json({ error: 'Failed to create zip' });
  });
  archive.pipe(res);

  // SKILL.md
  const skillMd = `# ${skill.name}

**Author:** ${skill.author}
**Version:** ${version}
**Category:** ${skill.category}
**Rating:** ${skill.rating}/5.0
**Downloads:** ${skill.downloads.toLocaleString()}

## Description

${skill.description}

## Tags

${skill.tags.map(t => `- ${t}`).join('\n')}
`;
  archive.append(skillMd, { name: 'SKILL.md' });

  // package.json
  const packageJson = JSON.stringify({
    name: skill.id,
    version: version,
    description: skill.description,
    author: skill.author,
    category: skill.category,
    tags: skill.tags,
    rating: skill.rating,
    downloads: skill.downloads,
    compatibility: ['Claude Code', 'ClawHub'],
    icon: skill.icon || ''
  }, null, 2);
  archive.append(packageJson, { name: 'package.json' });

  // README.md
  const readmeMd = `# ${skill.name}

> ${skill.description}

## Installation

### Via ClawHub Skills Store
1. Open the Skills Store at http://43.153.155.83:8082/
2. Search for "${skill.name}"
3. Click "Install"

### Manual Installation
1. Extract this zip to your skills directory:
   \`\`\`bash
   unzip ${zipName} -d ~/.openclaw/workspace/skills/${skill.id}/
   \`\`\`
2. Restart your agent or reload skills

## Usage

This skill provides: ${skill.tags.join(', ')} capabilities.

**Category:** ${skill.category}
**Author:** ${skill.author}
**Version:** ${version}

## Requirements

需要有效的API密钥和钱包连接

## Changelog

- v1.0 - 初始版本发布
- v1.1 - 性能优化和Bug修复
- v1.2 - 新增功能和API支持
`;
  archive.append(readmeMd, { name: 'README.md' });

  // Check for actual skill files on disk
  const skillDirs = [
    path.join('/root/.openclaw/workspace/skills', skill.id),
    path.join('/root/.openclaw/skills', skill.id),
    path.join(process.env.HOME || '/root', '.agents/skills', skill.id),
  ];

  for (const dir of skillDirs) {
    if (fs.existsSync(dir)) {
      archive.directory(dir, 'skill-files');
      break; // only include from first found location
    }
  }

  archive.finalize();
});

// Fallback: serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Skills Store running on port ${PORT}`);
});
