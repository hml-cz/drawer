import _extends from "@babel/runtime/helpers/esm/extends";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["prefixCls", "className", "containerRef", "placement", "drawerWidth", "onClose"];
import classNames from 'classnames';
import * as React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { RefContext } from "./context";
import pickAttrs from "rc-util/es/pickAttrs";
import { useComposeRef } from "rc-util/es/ref";
var DrawerPanel = function DrawerPanel(props) {
  var prefixCls = props.prefixCls,
    className = props.className,
    containerRef = props.containerRef,
    placement = props.placement,
    drawerWidth = props.drawerWidth,
    onClose = props.onClose,
    restProps = _objectWithoutProperties(props, _excluded);
  var _React$useContext = React.useContext(RefContext),
    panelRef = _React$useContext.panel;
  var mergedRef = useComposeRef(panelRef, containerRef);

  // =========================== Drag ============================
  var _useSpring = useSpring(function () {
      return {
        x: 0,
        opacity: 1
      };
    }),
    _useSpring2 = _slicedToArray(_useSpring, 2),
    _useSpring2$ = _useSpring2[0],
    x = _useSpring2$.x,
    opacity = _useSpring2$.opacity,
    api = _useSpring2[1];
  var bind = useDrag(function (_ref) {
    var down = _ref.down,
      _ref$movement = _slicedToArray(_ref.movement, 1),
      movementX = _ref$movement[0],
      _ref$direction = _slicedToArray(_ref.direction, 1),
      directionX = _ref$direction[0],
      cancel = _ref.cancel;
    // cancel drag to right if Drawer has left placement,
    // and cancel drag to left for right Drawer
    if (placement === 'left' && directionX === 1 || placement === 'right' && directionX === -1) {
      cancel();
    }
    if (Math.abs(movementX) < drawerWidth / 2) {
      // immediately move Drawer if drag is active (down is true)
      // for finished drag with movement less than half of Drawer width, set initial Drawer width
      api.start({
        x: down ? movementX : 0,
        immediate: down
      });
    } else {
      if (down === true) {
        // immediately move Drawer and change it`s opacity
        // for drag with movement more than half of Drawer width
        api.start({
          x: movementX,
          opacity: 0.7,
          immediate: true
        });
      } else {
        // close Drawer if drag is more than half of Drawer width and finished
        api.start({
          x: 0,
          opacity: 1,
          immediate: false
        });
        var _event = new CustomEvent('touchDragEvent');
        onClose(_event);
      }
    }
  }, {
    filterTaps: true,
    axis: 'x'
  });

  // =============================== Render ===============================
  return /*#__PURE__*/React.createElement(animated.div, _extends({
    className: classNames("".concat(prefixCls, "-content"), className),
    role: "dialog",
    ref: mergedRef
  }, pickAttrs(props, {
    aria: true
  }), {
    "aria-modal": "true"
  }, restProps, bind(), {
    style: {
      x: x,
      opacity: opacity
    }
  }));
};
if (process.env.NODE_ENV !== 'production') {
  DrawerPanel.displayName = 'DrawerPanel';
}
export default DrawerPanel;