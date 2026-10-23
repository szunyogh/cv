// Megnyitja az alapértelmezett levelezőprogramot előre kitöltött címzettel és tárggyal.

import { CONTACT_EMAIL, MAIL_SUBJECT } from './config.js';

export function openMailClient() {
  window.location.href =
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(MAIL_SUBJECT)}`;
}
