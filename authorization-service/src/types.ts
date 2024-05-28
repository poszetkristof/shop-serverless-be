import { EFFECTS } from './constants';

export type Effect = (typeof EFFECTS)[keyof typeof EFFECTS];
