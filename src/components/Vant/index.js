// https://vant-contrib.gitee.io/vant/v4/
import {
  Button,
  showToast,
  closeToast,
  showDialog,
  showNotify,
  Field,
  Form,
  Cell,
  CellGroup,
  NavBar,
  Search,
  Image,
  Lazyload,
  Swipe,
  SwipeItem,
  Loading,
  Tag,
  CountDown,
  Tabbar,
  TabbarItem,
  List,
  PullRefresh,
  TreeSelect,
  Icon,
  Progress,
  Rate,
  ActionBar,
  ActionBarIcon,
  ActionBarButton,
  AddressList,
  AddressEdit,
  SwipeCell,
  Card,
  SubmitBar,
  Checkbox,
  CheckboxGroup,
  Grid,
  GridItem,
  DropdownMenu,
  DropdownItem,
  ContactCard,
  ContactList,
  ContactEdit,
  Stepper,
  NoticeBar,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  Row,
  Col,
  Popup,
  Switch,
  Empty,
  Sticky,
  ShareSheet,
  Uploader,
  DatePicker,
  TimePicker,
  Picker,
} from 'vant'

export default function setupVant(app) {
  app
    .use(Field)
    .use(Form)
    .use(Button)
    .use(Cell)
    .use(CellGroup)
    .use(NavBar)
    .use(Search)
    .use(Image)
    .use(Lazyload)
    .use(Swipe)
    .use(SwipeItem)
    .use(Loading)
    .use(Tag)
    .use(CountDown)
    .use(Tabbar)
    .use(TabbarItem)
    .use(List)
    .use(PullRefresh)
    .use(TreeSelect)
    .use(Icon)
    .use(Progress)
    .use(Rate)
    .use(ActionBar)
    .use(ActionBarIcon)
    .use(ActionBarButton)
    .use(AddressList)
    .use(AddressEdit)
    .use(SwipeCell)
    .use(Card)
    .use(SubmitBar)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(Grid)
    .use(GridItem)
    .use(DropdownMenu)
    .use(DropdownItem)
    .use(ContactCard)
    .use(ContactList)
    .use(ContactEdit)
    .use(Stepper)
    .use(NoticeBar)
    .use(Radio)
    .use(RadioGroup)
    .use(Tab)
    .use(Tabs)
    .use(Row)
    .use(Col)
    .use(Popup)
    .use(Switch)
    .use(Empty)
    .use(Sticky)
    .use(ShareSheet)
    .use(Uploader)
    .use(DatePicker)
    .use(TimePicker)
    .use(Picker)

  const toast = (options) => showToast(options)
  toast.loading = (opts = {}) =>
    typeof opts === 'string'
      ? showToast({ type: 'loading', message: opts })
      : showToast({ type: 'loading', ...opts })
  toast.success = (msg) =>
    typeof msg === 'string'
      ? showToast({ type: 'success', message: msg })
      : showToast({ type: 'success', ...msg })
  toast.fail = (msg) =>
    typeof msg === 'string'
      ? showToast({ type: 'fail', message: msg })
      : showToast({ type: 'fail', ...msg })
  toast.clear = () => closeToast()

  const dialog = (options) => showDialog(options)
  dialog.alert = (options) => showDialog(options)
  dialog.confirm = (options) => showDialog({ showCancelButton: true, ...options })

  app.config.globalProperties.$toast = toast
  app.config.globalProperties.$dialog = dialog
  app.config.globalProperties.$notify = showNotify
}
