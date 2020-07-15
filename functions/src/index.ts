import * as functions from 'firebase-functions';
import { app as orders } from './orders';
import { app as refunds } from './refund';

export const ordersAPI = functions.https.onRequest(orders);
export const refundAPI = functions.https.onRequest(refunds);
