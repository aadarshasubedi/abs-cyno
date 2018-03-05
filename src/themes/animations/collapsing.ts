import {
    trigger,
    state,
    style,
    animate,
    transition,
    AnimationTriggerMetadata,
  } from '@angular/animations';

export const transition_collapsing = trigger('collapsing', [
    state('collapsing', style({
        position: 'relative',
        height: '0px',
        overflow: 'hidden',
        transition: 'height .35s ease'
    }))
])