import {
    trigger,
    state,
    style,
    animate,
    transition,
    AnimationTriggerMetadata,
  } from '@angular/animations';

export const transition_quickview = trigger('quickview', [
    state('open', style({
        right: '0px',
        transition: 'all .35s ease'
    })),
    state('close', style({
        right: '-400px',
        transition: 'all .35s ease'
    }))
])