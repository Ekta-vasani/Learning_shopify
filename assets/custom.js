function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) {
      return value;
    }
  }
  return null; // Cookie not found
}


// function freeShipping(){
// var shippingAvailable = false;
// var shippingEligible = false;
  
//   $.ajax({
//     type:'GET',
//     url:'/cart.json',
//     dataType:'Json',
//     success:function(data){
//       const shippingProtection = getCookie('shipping_protection');

//       var items = data.items;
//       console.log(items);

//         for(var i=0; i<items.length; i++){
//         if(items[i]['id'] == shipping_product_id){
//           shippingAvailable = true;
//           break;
          
      
//         }
        
//       }

//         if(shippingAvailable == false && shippingProtection != 'hide'){
//         $('#shipping_protection').prop('checked',true);
//       }

      
//         if(shippingAvailable == true && items.length == 1){
//         $('#shipping_protection').prop('checked',false);

//       }

//        if($('#shipping_protection').is(':checked')){
//         shippingEligible = true;

//       }else{
//         shippingEligible = false;

//       }
      
      
      
//       //   if(shippingAvailable == false  && shippingProtection != 'hide'){
//       //   $('#shipping_protection').prop('checked',true);
//       // }
      
//       // if(items.length == 1 && shippingAvailable == true && shippingEligible == true){
//       //           $('#shipping_protection').prop('checked',false);
//       //   shippingEligible = false;
                

//       // }

    
    
      
//         if(shippingEligible == true && shippingAvailable == false){
//         addShippingProtection(shipping_product_id)
//       }
//       else if(shippingEligible == false && shippingAvailable == true){

//         removeShippingProtection(shippingProtection,shipping_product_id,items)
//       }
     
      
//     },
//     error:function(){
//       console.log("Can not get cart Data");
//     }
//   })
// }

//   $(document).on('change','#shipping_protection', function() {
//      freeShipping();
//   });

// function addShippingProtection(shipping_product_id){
//  var cartDrawer = document.querySelector('cart-drawer');
//  var getSectionToRender = cartDrawer.getSectionsToRender().map((section) => section.id);

//   $.ajax({
//     type:'POST',
//     url:'/cart/add.js',
//     dataType:'Json',
//     data: JSON.stringify({
//       id:shipping_product_id,
//       sections: getSectionToRender,
//       sections_url: window.location.pathname,
//     }),
//      contentType: 'application/json',  
//     success:function(cart){
//       cartDrawer.renderContents(cart);
//       cartDrawer.open();
//       if (cartDrawer && cartDrawer.classList.contains('is-empty')) {
//                 cartDrawer.classList.remove('is-empty');
//             }
//       document.cookie = 'shipping_protection=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
//     },
//     error:function(){
//       console.log('Error to add shipping Protection')
//     }
//   })
// }

// function removeShippingProtection(shippingProtection,shipping_product_id,items)
// {
//    var cartDrawer = document.querySelector('cart-drawer');
//  var getSectionToRender = cartDrawer.getSectionsToRender().map((section) => section.id);

//   $.ajax({
//     type:'POST',
//     url:'/cart/change.js',
//     dataType:'Json',
//     data: JSON.stringify({
//       id:shipping_product_id,
//       quantity:0,
//       sections: getSectionToRender,
//       sections_url: window.location.pathname,
//     }),
//      contentType: 'application/json',  
//     success:function(cart){
//       cartDrawer.renderContents(cart);
//       cartDrawer.open();

      
//       if(shippingProtection != 'hide'){
//           document.cookie = 'shipping_protection=hide';
//         }

//       $.ajax({
//         type:'GET',
//         url:'/cart.json',
//         dataType:'Json',
//         contentType:'application/json',
//         success:function(data){
//            var items = data.items;
//           console.log('items',items)
//           if (cartDrawer && items.length < 1 ) { 
//               cartDrawer.classList.add('is-empty');
//               document.cookie = 'shipping_protection=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
            
//           }
//         }
//       })
      


//     },
//     error:function(){
//       console.log('Error to add shipping Protection')
//     }
//   })
  
// }


function free_product(){
  var freeProductAvailable = false;
  $.ajax({
    type:'get',
    url:'/cart.json',
    dataType:'json',
    contentType:'application/json',
    success:function(data){
      var itemList = data.items;
      var total_price = data.total_price;

     var dataItem = itemList.some((item) => freeProductId.includes(item.id));

      
      if(total_price > 600000 && !dataItem){
        freeProductAdd();
      }
      if(total_price < 600000 && dataItem == true){
        freeProductRemove();
      }
      
    },
    error:function(){
      console.log('Error in product add');
    }
  })
}


function freeProductAdd(){
  var cartDrawer = document.querySelector('cart-drawer');
  var sectionToRender = cartDrawer.getSectionsToRender().map((section) => section.id);
  var section_url = window.location.href;
  var freeProdutListId = freeProductId.map((items) => ({
    id:items,
    quantity:1
  }));
  $.ajax({
    type:'post',
    url:'/cart/add.js',
    data: JSON.stringify({
      items:freeProdutListId,
      sections:sectionToRender,
      section_url:section_url
    }),
    dataType:'json',
    contentType:'application/json',
    success:function(data){
      cartDrawer.renderContents(data);
      cartDrawer.open();
    },
    error:function(){
      console.log('Error in product add');
    }
  })
}


function freeProductRemove(){

  var updates = Object.fromEntries(freeProductId.map((id) => [id,0]));

  var cartDrawer = document.querySelector('cart-drawer');
  var sectionToRender = cartDrawer.getSectionsToRender().map((section) => section.id);
    var section_url = window.location.href;

  $.ajax({
    type:'post',
    url:'/cart/update.js',
    data:JSON.stringify({
      updates:updates,
      
      sections:sectionToRender,
      section_url:section_url
    }),
    dataType:'json',
    contentType:'application/json',
    success:function(data){
      cartDrawer.renderContents(data);
      cartDrawer.open();
    },
    error:function(){
      consoel.log('Error in product remove');
    }
  })
}