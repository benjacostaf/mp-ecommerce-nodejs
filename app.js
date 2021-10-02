var express = require('express');
var exphbs  = require('express-handlebars');
var port = process.env.PORT || 3000
const mercadopago = require('mercadopago');
var app = express();

mercadopago.configure({
    access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398',
    integrator_id:  'dev_24c65fb163bf11ea96500242ac130004'
});

 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', function (req, res) {
    res.render('home', {url: 'home'});
});

app.get('/detail', function (req, res) {
    res.render('detail', {url: 'item', data: req.query});
});

app.post('/create_preference', (req, res) => {
    let preference = {
        items: [
            {
                id: req.body.id,
                title: req.body.title,
                description: req.body.description,
                picture_url: req.body.img,
                unit_price: Number(req.body.price),
                quantity: Number(req.body.quantity),
                
            }
        ],
        external_reference: "benjacostaf@hotmail.com",
        notification_url: "https://benjacostaf-mp-commerce-nodejs.herokuapp.com/notifications",
        back_urls: {
            "success": "https://benjacostaf-mp-commerce-nodejs.herokuapp.com/feedback",
            "failure": "https://benjacostaf-mp-commerce-nodejs.herokuapp.com/feedback",
            "pending": "https://benjacostaf-mp-commerce-nodejs.herokuapp.com/feedback"
        },
        auto_return: "approved",
        payment_methods: {
            excluded_payment_methods: [
                {
                    id: "amex"
                }
            ],
            excluded_payment_types: [
                {
                    id: "atm"
                }
            ],
            installments: 6
        },
        site_id: "MLA",
        payer: {
            name: "Lalo",
            surname: "Landa",
            email: "test_user_63274575@testuser.com",
            phone: {
                area_code: 11,
                number: 22223333
            },
            address: {
                zip_code: 1111,
                street_name: "Falsa",
                street_number: 123
            }
        }
    };

    mercadopago.preferences.create(preference).then(function(response){
        res.json({
            id: response.body.id
        });
    }).catch(function(error){
        console.log(error);
    });
});

app.get('/feedback', function(req, res){
    res.json({ PaymentID: req.query.payment_id,
                status: req.query.status,
                PaymentMethod: req.query.payment_method_id,
                MerchantOrder: req.query.merchant_order_id});
});

app.get('/notifications', function(req, res){
    res.json({
        dataWebhook : req.body
    });
});

app.listen(port);