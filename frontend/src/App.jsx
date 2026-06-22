import { useEffect, useState } from "react";
import {
  Activity,
  Boxes,
  CloudCog,
  Gauge,
  PackageSearch,
  ServerCog,
} from "lucide-react";
import InventoryTable from "./components/InventoryTable";
import MetricCard from "./components/MetricCard";
import ServiceStatus from "./components/ServiceStatus";
import {
  getDashboardMetrics,
  getProducts,
} from "./services/api";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalInventory: 0,
    lowStockProducts: 0,
    apiStatus: "Checking",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [productData, metricData] = await Promise.all([
          getProducts(),
          getDashboardMetrics(),
        ]);

        setProducts(productData);
        setMetrics(metricData);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <CloudCog size={24} />
          </div>

          <div>
            <strong>CloudCart</strong>
            <span>Observability</span>
          </div>
        </div>

        <nav>
          <a className="active" href="#dashboard">
            <Gauge size={19} />
            Dashboard
          </a>

          <a href="#inventory">
            <PackageSearch size={19} />
            Inventory
          </a>

          <a href="#services">
            <ServerCog size={19} />
            Services
          </a>

          <a href="#monitoring">
            <Activity size={19} />
            Monitoring
          </a>
        </nav>

        <div className="sidebar-footer">
          <span>Portfolio DevOps Project</span>
          <strong>Docker · Kubernetes</strong>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="page-header">
          <div>
            <p className="eyebrow">OPERATIONS OVERVIEW</p>
            <h1>CloudCart Dashboard</h1>
            <p>
              Monitor application services, inventory, and platform
              performance from one interface.
            </p>
          </div>

          <div className="environment-badge">
            <span />
            Local development
          </div>
        </header>

        <section className="metric-grid">
          <MetricCard
            icon={Boxes}
            label="Products"
            value={metrics.totalProducts}
            description="Tracked inventory items"
          />

          <MetricCard
            icon={PackageSearch}
            label="Inventory"
            value={metrics.totalInventory}
            description="Units currently available"
          />

          <MetricCard
            icon={Activity}
            label="Low stock"
            value={metrics.lowStockProducts}
            description="Products requiring attention"
          />

          <MetricCard
            icon={ServerCog}
            label="API status"
            value={metrics.apiStatus}
            description="Backend connection state"
          />
        </section>

        <section className="dashboard-grid">
          <div id="inventory">
            <InventoryTable
              products={products}
              loading={loading}
            />
          </div>

          <div id="services">
            <ServiceStatus />

            <section className="panel monitoring-preview" id="monitoring">
              <p className="eyebrow">COMING NEXT</p>
              <h2>Performance monitoring</h2>
              <p>
                Prometheus will collect request, latency, error, CPU,
                memory, and database metrics. Grafana will visualize them.
              </p>

              <div className="monitoring-bars">
                <span style={{ width: "84%" }} />
                <span style={{ width: "62%" }} />
                <span style={{ width: "73%" }} />
                <span style={{ width: "48%" }} />
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
