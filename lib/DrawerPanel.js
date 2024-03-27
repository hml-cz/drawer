

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _classnames = _interopRequireDefault(require("classnames"));
var React = _interopRequireWildcard(require("react"));
var _web = require("@react-spring/web");
var _react2 = require("@use-gesture/react");
var _context = require("./context");
var _pickAttrs = _interopRequireDefault(require("rc-util/lib/pickAttrs"));
var _ref2 = require("rc-util/lib/ref");
var _excluded = ["prefixCls", "className", "containerRef", "placement", "drawerWidth", "onClose"];
var DrawerPanel = function DrawerPanel(props) {
  var prefixCls = props.prefixCls,
    className = props.className,
    containerRef = props.containerRef,
    placement = props.placement,
    drawerWidth = props.drawerWidth,
    onClose = props.onClose,
    restProps = (0, _objectWithoutProperties2.default)(props, _excluded);
  var _React$useContext = React.useContext(_context.RefContext),
    panelRef = _React$useContext.panel;
  var mergedRef = (0, _ref2.useComposeRef)(panelRef, containerRef);

  // =========================== Drag ============================
  var _useSpring = (0, _web.useSpring)(function () {
      return {
        x: 0,
        opacity: 1
      };
    }),
    _useSpring2 = (0, _slicedToArray2.default)(_useSpring, 2),
    _useSpring2$ = _useSpring2[0],
    x = _useSpring2$.x,
    opacity = _useSpring2$.opacity,
    api = _useSpring2[1];
  var bind = (0, _react2.useDrag)(function (_ref) {
    var down = _ref.down,
      _ref$movement = (0, _slicedToArray2.default)(_ref.movement, 1),
      movementX = _ref$movement[0],
      _ref$direction = (0, _slicedToArray2.default)(_ref.direction, 1),
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
  return /*#__PURE__*/React.createElement(_web.animated.div, (0, _extends2.default)({
    className: (0, _classnames.default)("".concat(prefixCls, "-content"), className),
    role: "dialog",
    ref: mergedRef
  }, (0, _pickAttrs.default)(props, {
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
var _default = exports.default = DrawerPanel;