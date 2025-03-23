import {Composer} from "grammy";
import {commands} from "./commands";

export const handlers = new Composer();

handlers.use(commands)
