"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[397],{2397:function(t,e,r){r.r(e),r.d(e,{EditionDrop:function(){return n}});var a=r(6935),i=r(22557),s=r(9279);r(13550),r(25025),r(70332),r(8455),r(54098),r(26729),r(62555),r(26219),r(61303),r(49242),r(70565),r(13670),r(79120),r(97604),r(8187),r(19362),r(54730),r(36250),r(85725),r(38730),r(237),r(65609),r(77208),r(86841),r(49561),r(40553),r(26),r(69392),r(82037),r(64063),r(34161),r(50266),r(98839),r(51375),r(43320),r(65815),r(59189),r(40721),r(24601),r(46878),r(20583),r(92355),r(84194),r(51121),r(32484),r(78435);class n extends i.aN{constructor(t,e,r){let s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},c=arguments.length>4?arguments[4]:void 0;super(arguments.length>5&&void 0!==arguments[5]?arguments[5]:new i.cn(t,e,c,s),r),(0,a._)(this,"abi",void 0),(0,a._)(this,"sales",void 0),(0,a._)(this,"platformFees",void 0),(0,a._)(this,"encoder",void 0),(0,a._)(this,"estimator",void 0),(0,a._)(this,"events",void 0),(0,a._)(this,"metadata",void 0),(0,a._)(this,"roles",void 0),(0,a._)(this,"royalties",void 0),(0,a._)(this,"claimConditions",void 0),(0,a._)(this,"checkout",void 0),(0,a._)(this,"history",void 0),(0,a._)(this,"interceptor",void 0),(0,a._)(this,"erc1155",void 0),(0,a._)(this,"owner",void 0),this.abi=c,this.metadata=new i.ah(this.contractWrapper,i.co,this.storage),this.roles=new i.ai(this.contractWrapper,n.contractRoles),this.royalties=new i.aj(this.contractWrapper,this.metadata),this.sales=new i.ak(this.contractWrapper),this.claimConditions=new i.an(this.contractWrapper,this.metadata,this.storage),this.events=new i.aS(this.contractWrapper),this.history=new i.ao(this.events),this.encoder=new i.ag(this.contractWrapper),this.estimator=new i.aR(this.contractWrapper),this.platformFees=new i.aU(this.contractWrapper),this.interceptor=new i.aT(this.contractWrapper),this.erc1155=new i.aG(this.contractWrapper,this.storage),this.checkout=new i.cm(this.contractWrapper),this.owner=new i.aW(this.contractWrapper)}onNetworkUpdated(t){this.contractWrapper.updateSignerOrProvider(t)}getAddress(){return this.contractWrapper.readContract.address}async getAll(t){return this.erc1155.getAll(t)}async getOwned(t){return this.erc1155.getOwned(t)}async getTotalCount(){return this.erc1155.totalCount()}async isTransferRestricted(){return!(await this.contractWrapper.readContract.hasRole((0,i.bt)("transfer"),s.d))}async createBatch(t,e){return this.erc1155.lazyMint(t,e)}async getClaimTransaction(t,e,r){let a=!(arguments.length>3&&void 0!==arguments[3])||arguments[3];return this.erc1155.getClaimTransaction(t,e,r,{checkERC20Allowance:a})}async claimTo(t,e,r){let a=!(arguments.length>3&&void 0!==arguments[3])||arguments[3];return this.erc1155.claimTo(t,e,r,{checkERC20Allowance:a})}async claim(t,e){let r=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];const a=await this.contractWrapper.getSignerAddress();return this.claimTo(a,t,e,r)}async burnTokens(t,e){return this.erc1155.burn(t,e)}async call(t){for(var e=arguments.length,r=new Array(e>1?e-1:0),a=1;a<e;a++)r[a-1]=arguments[a];return this.contractWrapper.call(t,...r)}}(0,a._)(n,"contractRoles",["admin","minter","transfer"])}}]);