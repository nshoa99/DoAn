import { OrderItem } from "./order-item";
import {User} from "@frontend/users";
export class Order {
    id?: any;
    orderItems?: any;
    shippingAddress1?: string;
    shippingAddress2?: string;
    city?: string;
    zip?: string;
    country?: string;
    phone?: string;
    status?: string;
    totalPrice?: string;
    user?: any;
    dateOrdered?: string;    
}