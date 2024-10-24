import {
  trigger,
  state,
  style,
  animate,
  transition,
  group,
  AnimationReferenceMetadata,
  animation,
  keyframes
} from '@angular/animations';

export const cadrartAnimationSlideInOut = [
  trigger('slideInOut', [
    state(
      'extended',
      style({
        height: '*',
        opacity: '1',
        pointerEvents: 'all'
      })
    ),
    state(
      'collapsed',
      style({
        height: '0',
        opacity: '0',
        pointerEvents: 'none'
      })
    ),
    transition('extended => collapsed', [
      group([
        animate(
          '300ms ease-in-out',
          style({
            height: '0',
            opacity: '0',
            pointerEvents: 'none'
          })
        )
      ])
    ]),
    transition('collapsed => extended', [
      group([
        animate(
          '300ms ease-in-out',
          style({
            height: '*',
            opacity: '1',
            pointerEvents: 'all'
          })
        )
      ])
    ])
  ])
];

export function cadrartAnimationFlipInConstructor(
  rotateX: number,
  rotateY: number,
  finalOpacity = 1
): AnimationReferenceMetadata {
  return animation(
    [
      style({ 'backface-visibility': 'visible' }),
      animate(
        '{{ timing }}s {{ delay }}s ease-in',
        keyframes([
          style({
            opacity: 0,
            transform: 'perspective(400px) rotate3d({{ rotateX }}, {{ rotateY }}, 0, 90deg)',
            offset: 0
          }),
          style({
            opacity: finalOpacity,
            transform: 'perspective(400px) rotate3d({{ rotateX }}, {{ rotateY }}, 0, -20deg)',
            offset: 0.4
          }),
          style({
            transform: 'perspective(400px) rotate3d({{ rotateX }}, {{ rotateY }}, 0, 10deg)',
            offset: 0.6
          }),
          style({
            transform: 'perspective(400px) rotate3d({{ rotateX }}, {{ rotateY }}, 0, -5deg)',
            offset: 0.8
          }),
          style({
            transform: 'perspective(400px) rotate3d(0, 0, 0, 0)',
            offset: 1
          })
        ])
      )
    ],
    { params: { timing: '.3', delay: 0, rotateX, rotateY } }
  );
}

export const cadrartAnimationFlipInX = (finalOpacity = 1) => cadrartAnimationFlipInConstructor(1, 0, finalOpacity);
export const cadrartAnimationFlipInY = (finalOpacity = 1) => cadrartAnimationFlipInConstructor(0, 1, finalOpacity);

export function cadrartAnimationFlipOutConstructor(
  rotateX: number,
  rotateY: number,
  finalOpacity = 1
): AnimationReferenceMetadata {
  return animation(
    [
      style({ 'backface-visibility': 'visible' }),
      animate(
        '{{ timing }}s {{ delay }}s',
        keyframes([
          style({
            transform: 'perspective(400px)',
            offset: 0
          }),
          style({
            opacity: finalOpacity,
            transform: 'perspective(400px) rotate3d({{ rotateX }}, {{ rotateY }}, 0, -20deg)',
            offset: 0.3
          }),
          style({
            opacity: 0,
            transform: 'perspective(400px) rotate3d({{ rotateX }}, {{ rotateY }}, 0, 90deg)',
            offset: 1
          })
        ])
      )
    ],
    { params: { timing: '.3', delay: 0, rotateX, rotateY } }
  );
}

export const cadrartAnimationFlipOutX = (finalOpacity = 1) => cadrartAnimationFlipOutConstructor(1, 0, finalOpacity);
export const cadrartAnimationFlipOutY = (finalOpacity = 1) => cadrartAnimationFlipOutConstructor(0, 1, finalOpacity);
