import { AlgorandAlgodToken, AlgorandAlgodUrl } from "@lib/config";
import algosdk from "algosdk";

export default new algosdk.Algodv2(AlgorandAlgodToken, AlgorandAlgodUrl);