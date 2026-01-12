document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'https://5d76bf96515d1a0014085cf9.mockapi.io/order';

    // Fetch existing orders then POST a new order object as JSON.
    fetch(apiUrl)
        .then(function (res) {
            if (!res.ok) throw new Error('Failed to fetch orders: ' + res.status);
            return res.json();
        })
        .then(function (orders) {
            const newOrder = {
                id: (Array.isArray(orders) ? orders.length : 0) + 1,
                amount: 200,
                product: ['userOrder']
            };

            return fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder)
            });
        })
        .then(function (postRes) {
            if (postRes && postRes.ok) {
                // Clear order-related cookies safely (expire them)
                document.cookie = 'orderId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
                document.cookie = 'counter=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
            } else {
                console.error('Failed to create order', postRes && postRes.status);
            }
        })
        .catch(function (err) {
            console.error('orderPlaced.js error:', err);
        });
});
