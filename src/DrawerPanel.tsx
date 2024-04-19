import classNames from 'classnames';
import * as React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import type { Placement } from './DrawerPopup';
import { RefContext } from './context';
import pickAttrs from 'rc-util/lib/pickAttrs';
import { useComposeRef } from 'rc-util/lib/ref';

export interface DrawerPanelRef {
  focus: VoidFunction;
}

export interface DrawerPanelEvents {
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseOver?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onKeyUp?: React.KeyboardEventHandler<HTMLDivElement>;
  onClose?: (
    event:
      | React.MouseEvent<HTMLElement>
      | React.KeyboardEvent<HTMLElement>
      | CustomEvent<HTMLElement>,
  ) => void;
}

export type DrawerPanelAccessibility = Pick<
  React.DialogHTMLAttributes<HTMLDivElement>,
  keyof React.AriaAttributes
>;

export interface DrawerPanelProps
  extends DrawerPanelEvents,
    DrawerPanelAccessibility {
  prefixCls: string;
  placement: Placement;
  drawerWidth: number;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  containerRef?: React.Ref<HTMLDivElement>;
  isDraggable?: boolean;
}

const DrawerPanel = (props: DrawerPanelProps) => {
  const {
    prefixCls,
    className,
    containerRef,
    placement,
    drawerWidth,
    onClose,
    isDraggable = false,
    ...restProps
  } = props;

  const { panel: panelRef } = React.useContext(RefContext);
  const mergedRef = useComposeRef(panelRef, containerRef);

  // =========================== Drag ============================
  const [{ x, opacity }, api] = useSpring(() => ({ x: 0, opacity: 1 }));

  const bind = useDrag(
    ({ down, movement: [movementX], direction: [directionX], cancel }) => {
      // cancel drag to right if Drawer has left placement,
      // and cancel drag to left for right Drawer
      if (
        isDraggable === false ||
        (placement === 'left' && directionX === 1) ||
        (placement === 'right' && directionX === -1)
      ) {
        cancel();
      }

      if (Math.abs(movementX) < drawerWidth / 2) {
        // immediately move Drawer if drag is active (down is true)
        // for finished drag with movement less than half of Drawer width, set initial Drawer width
        api.start({ x: down ? movementX : 0, immediate: down });
      } else {
        if (down === true) {
          // immediately move Drawer and change it`s opacity
          // for drag with movement more than half of Drawer width
          api.start({ x: movementX, opacity: 0.7, immediate: true });
        } else {
          // close Drawer if drag is more than half of Drawer width and finished
          api.start({ x: 0, opacity: 1, immediate: false });
          const event: CustomEvent<HTMLElement> = new CustomEvent(
            'touchDragEvent',
          );
          onClose(event);
        }
      }
    },
    { filterTaps: true, axis: 'x' },
  );

  // =============================== Render ===============================
  return (
    <animated.div
      className={classNames(`${prefixCls}-content`, className)}
      role="dialog"
      ref={mergedRef}
      {...pickAttrs(props, { aria: true })}
      aria-modal="true"
      {...restProps}
      // @ts-ignore
      {...bind()}
      style={{ x, opacity }}
    />
  );
};

if (process.env.NODE_ENV !== 'production') {
  DrawerPanel.displayName = 'DrawerPanel';
}

export default DrawerPanel;
