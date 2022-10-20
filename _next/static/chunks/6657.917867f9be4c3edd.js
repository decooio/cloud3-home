"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6657],{56657:function(t,e,r){r.r(e),r.d(e,{Token:function(){return i}});var a=r(6935),n=r(22557),s=r(9279);r(13550),r(25025),r(70332),r(8455),r(54098),r(26729),r(62555),r(26219),r(61303),r(49242),r(70565),r(13670),r(79120),r(97604),r(8187),r(19362),r(54730),r(36250),r(85725),r(38730),r(237),r(65609),r(77208),r(86841),r(49561),r(40553),r(26),r(69392),r(82037),r(64063),r(34161),r(50266),r(98839),r(51375),r(43320),r(65815),r(59189),r(40721),r(24601),r(46878),r(20583),r(92355),r(84194),r(51121),r(32484),r(78435);class i extends n.av{constructor(t,e,r){let s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},c=arguments.length>4?arguments[4]:void 0;super(arguments.length>5&&void 0!==arguments[5]?arguments[5]:new n.cn(t,e,c,s),r),(0,a._)(this,"abi",void 0),(0,a._)(this,"metadata",void 0),(0,a._)(this,"roles",void 0),(0,a._)(this,"encoder",void 0),(0,a._)(this,"estimator",void 0),(0,a._)(this,"history",void 0),(0,a._)(this,"events",void 0),(0,a._)(this,"platformFees",void 0),(0,a._)(this,"sales",void 0),(0,a._)(this,"signature",void 0),(0,a._)(this,"interceptor",void 0),this.abi=c,this.metadata=new n.ah(this.contractWrapper,n.cL,this.storage),this.roles=new n.ai(this.contractWrapper,i.contractRoles),this.sales=new n.ak(this.contractWrapper),this.events=new n.aS(this.contractWrapper),this.history=new n.as(this.contractWrapper,this.events),this.encoder=new n.ag(this.contractWrapper),this.estimator=new n.aR(this.contractWrapper),this.platformFees=new n.aU(this.contractWrapper),this.interceptor=new n.aT(this.contractWrapper),this.signature=new n.at(this.contractWrapper,this.roles)}async getVoteBalance(){return await this.getVoteBalanceOf(await this.contractWrapper.getSignerAddress())}async getVoteBalanceOf(t){return await this.erc20.getValue(await this.contractWrapper.readContract.getVotes(t))}async getDelegation(){return await this.getDelegationOf(await this.contractWrapper.getSignerAddress())}async getDelegationOf(t){return await this.contractWrapper.readContract.delegates(t)}async isTransferRestricted(){return!(await this.contractWrapper.readContract.hasRole((0,n.bt)("transfer"),s.d))}async mint(t){return this.erc20.mint(t)}async mintTo(t,e){return this.erc20.mintTo(t,e)}async mintBatchTo(t){return this.erc20.mintBatchTo(t)}async delegateTo(t){return{receipt:await this.contractWrapper.sendTransaction("delegate",[t])}}async burn(t){return this.erc20.burn(t)}async burnFrom(t,e){return this.erc20.burnFrom(t,e)}async call(t){for(var e=arguments.length,r=new Array(e>1?e-1:0),a=1;a<e;a++)r[a-1]=arguments[a];return this.contractWrapper.call(t,...r)}}(0,a._)(i,"contractRoles",["admin","minter","transfer"])}}]);