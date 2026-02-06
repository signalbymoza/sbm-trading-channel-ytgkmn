
import React from 'react';
import { Platform } from 'react-native';

// This is the base payment file that acts as a fallback
// On web, payment.web.tsx will be used instead
// On native (iOS/Android), payment.native.tsx will be used instead

// This file should never actually be rendered, but if it is,
// we'll redirect to the web version
export { default } from './payment.web';
