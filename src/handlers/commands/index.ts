import {Composer} from "grammy";
import {commandStart} from "./start";

export const commands = new Composer();

commands.use(commandStart)