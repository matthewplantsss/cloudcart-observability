function InventoryTable({ products, loading }) {
  return (
    <section className="panel inventory-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">DATABASE INVENTORY</p>
          <h2>Products</h2>
        </div>

        <span>{products.length} products</span>
      </div>

      {loading ? (
        <div className="loading-state">Loading inventory...</div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Inventory</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                    <span>Product ID: {product.id}</span>
                  </td>

                  <td>{product.category}</td>

                  <td>${Number(product.price).toFixed(2)}</td>

                  <td>{product.inventory}</td>

                  <td>
                    <span
                      className={`stock-status stock-status-${product.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default InventoryTable;
