// Tăng giảm số lượng
function quantitydown(i) {
    var waitting_buy = JSON.parse(localStorage.getItem('waitting_buy'));
    if (waitting_buy[i].soluong > 1) waitting_buy[i].soluong--;
    var inputElement = document.getElementsByClassName('qty-input numeric-input');
    inputElement[i].value = waitting_buy[i].soluong;
    localStorage.setItem('waitting_buy', JSON.stringify(waitting_buy));
    inner_cart();
}

function quantityup(i) {
    var waitting_buy = JSON.parse(localStorage.getItem('waitting_buy'));
    waitting_buy[i].soluong++;
    var inputElement = document.getElementsByClassName('qty-input numeric-input');
    inputElement[i].value = waitting_buy[i].soluong;
    localStorage.setItem('waitting_buy', JSON.stringify(waitting_buy));
    inner_cart();
}

// Fill sản phảm đã đặt vào
function inner_cart() {
    var waitting_buy = JSON.parse(localStorage.getItem('waitting_buy'));
    var body_cart = document.getElementById('body-cart');
    var list = '';
    if (waitting_buy !== null) {
        for (var i = 0; i < waitting_buy.length; i++) {
            list += `<tr>
		<td style="color: blue" class="product-info1">
			<img src="${waitting_buy[i].hinhanhitem}" alt="alo" />
			<p>${formatNumberWithCommas(waitting_buy[i].gia)}VND</p>
		</td>
		<td class="product-info2">
			${waitting_buy[i].tensp}
			<br />
			Màu: ${waitting_buy[i].mau}
			<br />
			Dung luong: ${waitting_buy[i].luutru}
		</td>
		<td class="quantity">
			<div class="cart-quantity-input-container">
				<button class="buttom-tru" type="button" onclick="quantitydown(${i})">-</button>
				<input class="qty-input numeric-input"  type="text" value="${waitting_buy[i].soluong}" disabled data-index="${i}"/>
				<button class="buttom-cong" type="button" onclick="quantityup(${i})">+</button>
			</div>
		</td>
		<td class="unit-price">${formatNumberWithCommas(waitting_buy[i].gia * waitting_buy[i].soluong)}VND</td>
		<td class="option" style="cursor: pointer;">
			<i class="fa fa-trash" aria-hidden="true" onclick="trashcart(${i})"></i>
		</td>
        </tr>`;
        }
        body_cart.innerHTML = list;
    }
    if (list === '') {
        var noproduct = `
        <br>
        <p>Không có sản phẩm nào</p>`;
        document.getElementById('noproduct').innerHTML = noproduct;
        body_cart.innerHTML = '';
    }
    var total_cart = document.getElementById('total-price');
    total_cart.innerHTML = `Tổng tiền: ${formatNumberWithCommas(calculateTotalPrice())}VND`;
}

// Tính tổng tiền cho toàn bộ giỏ hàng
function calculateTotalPrice() {
    var waitting_buy = JSON.parse(localStorage.getItem('waitting_buy'));
    var totalPrice = 0;
    var tempPrice = 0;
    if (waitting_buy !== null) {
        waitting_buy.forEach(function (waitting_buy) {
            tempPrice = waitting_buy.gia * waitting_buy.soluong;
            totalPrice += tempPrice;
        });
    }
    return totalPrice;
}

// Xóa sp đã đặt
function trashcart(index) {
    var waitting_buy = JSON.parse(localStorage.getItem('waitting_buy'));
    waitting_buy.splice(index, 1);
    localStorage.setItem('waitting_buy', JSON.stringify(waitting_buy));
    inner_cart();
}

// Đặt hàng
function createOrder() {
    var check_admin = JSON.parse(localStorage.getItem('check_admin'));
    if (check_admin == true) var user = JSON.parse(localStorage.getItem('admin'));
    else var user = JSON.parse(localStorage.getItem('user'));
    var waitting_buy = JSON.parse(localStorage.getItem('waitting_buy'));
    var index_login = JSON.parse(localStorage.getItem('index_login'));
    // Kiểm tra xem đã đăng nhập chưa
    if (index_login == -1) {
        showMessage_error('Bạn phải đăng nhập để mua sản phẩm!');
        return false;
    }
    // Kiểm tra xem đã đặt hàng chưa
    if (waitting_buy === null) {
        showMessage_error('Chưa có sản phẩm trong giỏ hàng!');
        return false;
    }
    // Tạo đơn hàng
    const ngay = new Date(); // lấy ngày hiện tại
    const madon = Math.ceil(new Date().getTime() / 10000)
        .toFixed(0)
        .slice(-3);
    const order = {
        madon: '#' + madon,
        user: user[index_login],
        Ngaydat: ngay.getDate() + '/' + (ngay.getMonth() + 1) + '/' + ngay.getFullYear(),
        Sanpham: waitting_buy, // mảng waitting_buy
        Tongtien: calculateTotalPrice(), //tong tien
        Trangthai: 'Chưa xử lý',
    };
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    if (orders.length === 0) {
        orders = [order]; //mang rong
    } else {
        orders.push(order); //them order moi vao mang da co san
    }
    localStorage.setItem('orders', JSON.stringify(orders)); //// lưu mảng orders vào localStorage
    showMessage('Đặt hàng thành công!');
    // xóa mảng waitting_buy
    localStorage.removeItem('waitting_buy');
    inner_cart();
    return true;
}
