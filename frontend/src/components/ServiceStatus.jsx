import { CheckCircle2, CircleDot, Database, Server } from "lucide-react";

const services = [
  {
    name: "React Frontend",
    description: "User interface",
    icon: CircleDot,
    status: "Running",
  },
  {
    name: "Express API",
    description: "Application backend",
    icon: Server,
    status: "Demo mode",
  },
  {
    name: "PostgreSQL",
    description: "Persistent database",
    icon: Database,
    status: "Pending",
  },
];

function ServiceStatus() {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">SYSTEM HEALTH</p>
          <h2>Service status</h2>
        </div>

        <span className="live-badge">
          <CheckCircle2 size={15} />
          Frontend online
        </span>
      </div>

      <div className="service-list">
        {services.map(({ name, description, icon: Icon, status }) => (
          <article className="service-item" key={name}>
            <div className="service-icon">
              <Icon size={20} />
            </div>

            <div>
              <strong>{name}</strong>
              <span>{description}</span>
            </div>

            <span
              className={`service-status service-status-${status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {status}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ServiceStatus;
