
const express = require('express');
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');
var moment = require('moment');

const SettingsBill = require('./setting-bill')

const app = express();
const settingBill = SettingsBill();

const handlebarSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath:  './views',
    layoutsDir : './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended : false}));

app.use(bodyParser.json())

app.get('/', function(req, res){
    res.render('index', {
     settings: 
   settingBill.getSettings(),
       totals: settingBill.totals(),
       color: settingBill.totalClassName()
   }
   );
});

app.post('/settings', function(req, res){
   
   settingBill.setSettings({ 
       callCost: req.body.callCost,
       smsCost: req.body.smsCost,
       warningLevel: req.body.warningLevel,
       criticalLevel: req.body.criticalLevel
   });

  res.redirect('/');
});

app.post('/action', function(req, res){
 settingBill.recordAction(req.body.actionType)
   //capture the call type to add

   console.log(req.body.actionType);
  res.redirect('/');
});

app.get('/actions', function(req, res){
  res.render('actions', 
{actions: settingBill.actions})
});

app.get('/actions/:actionType', (req, res) => {
  const actionType = req.params.actionType
  res.render('actions', { actions: settingBill.actionsFor(actionType)})
})


const PORT = process.env.PORT || 3011;

app.listen(PORT, function(){
console.log("app started at port")
});
