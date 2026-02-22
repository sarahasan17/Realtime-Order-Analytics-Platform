<h1 align="center">🚀 Real-Time Order Analytics Platform</h1>

<p align="center">
A fully containerized real-time data pipeline built using 
<b>Apache Kafka</b>, <b>MongoDB</b>, <b>Node.js</b>, <b>C++</b>, and <b>Docker</b>, 
featuring live analytics and interactive visualizations.
</p>

<hr/>

<h2>📌 Overview</h2>

<p>This project demonstrates a complete end-to-end <b>event-driven architecture</b>:</p>

<ul>
  <li> <b>C++ Producer</b> generates order events</li>
  <li> <b>Apache Kafka</b> streams events</li>
  <li><b>Node.js Analytics Service</b> consumes events</li>
  <li><b>MongoDB</b> stores processed data</li>
  <li><b>Live Dashboard</b> visualizes insights</li>
</ul>

<p>The system simulates a production-grade scalable event processing pipeline.</p>

<hr/>

<h2>🏗 System Architecture</h2>

<pre>
C++ Producer → Kafka Topic → Node.js Consumer → MongoDB → Dashboard UI
</pre>

<h3>🔄 Data Flow</h3>

<ol>
  <li>Producer sends order JSON events to Kafka</li>
  <li>Analytics service consumes messages</li>
  <li>Events are persisted in MongoDB</li>
  <li>REST API exposes stored data</li>
  <li>Dashboard renders KPIs and charts</li>
</ol>

<hr/>

<h2>🧰 Tech Stack</h2>

<table border="1" cellpadding="8" cellspacing="0">
  <tr>
    <th>Layer</th>
    <th>Technology</th>
  </tr>
  <tr>
    <td> Streaming</td>
    <td>Apache Kafka (KRaft mode)</td>
  </tr>
  <tr>
    <td> Backend</td>
    <td>Node.js + Express</td>
  </tr>
  <tr>
    <td> Database</td>
    <td>MongoDB</td>
  </tr>
  <tr>
    <td> Producer</td>
    <td>C++</td>
  </tr>
  <tr>
    <td> Visualization</td>
    <td>Chart.js</td>
  </tr>
  <tr>
    <td> Containerization</td>
    <td>Docker & Docker Compose</td>
  </tr>
</table>

<hr/>

<h2>📂 Project Structure</h2>

<pre>
kafka-kraft-cpp/
│
├── analytics/
│   ├── analytics.js
│   ├── Dockerfile
│   └── public/
│       ├── dashboard.html
│       ├── dashboard.js
│       └── styles.css
│
├── cpp/
│   ├── producer.cpp
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
</pre>

<hr/>

<h2>⚙️ Setup & Run</h2>

<h3>1️⃣ Clone the Repository</h3>

<pre>
git clone https://github.com/your-username/real-time-order-analytics.git
cd kafka-kraft-cpp
</pre>

<h3>2️⃣ Start All Services</h3>

<pre>
docker compose up --build -d
</pre>

<h3>3️⃣ Access the Services</h3>

<table border="1" cellpadding="8" cellspacing="0">
  <tr>
    <th>Service</th>
    <th>URL</th>
  </tr>
  <tr>
    <td>📊 Dashboard</td>
    <td>http://localhost:9001/dashboard.html</td>
  </tr>
  <tr>
    <td>📦 Orders API</td>
    <td>http://localhost:9001/orders</td>
  </tr>
  <tr>
    <td>📡 Kafka UI</td>
    <td>http://localhost:8080</td>
  </tr>
  <tr>
    <td>🗄 MongoDB</td>
    <td>localhost:27017</td>
  </tr>
</table>

<hr/>

<h2>📊 Dashboard Features</h2>

<ul>
  <li> Total Orders KPI</li>
  <li> Total Revenue KPI</li>
  <li> Revenue Trend (Line Chart)</li>
  <li> Status Distribution (Pie Chart)</li>
  <li> Orders Per Customer (Bar Chart)</li>
  <li> Recent Orders Table</li>
  <li> Auto-refresh every 10 seconds</li>
</ul>

<hr/>

<h2>🛠 Event Format</h2>

<p>Orders are published in JSON format:</p>

<pre>
{
  "orderId": 1001,
  "customer": "Sara",
  "amount": 562,
  "currency": "INR",
  "status": "SHIPPED",
  "timestamp": 1771789076
}
</pre>

<hr/>

<h2>🧠 Key Concepts Demonstrated</h2>

<ul>
  <li>Event-driven architecture</li>
  <li>Real-time stream processing</li>
  <li>Kafka consumer groups</li>
  <li>Data persistence with MongoDB</li>
  <li>REST API design</li>
  <li>Docker multi-service orchestration</li>
  <li>Frontend auto-refresh polling</li>
  <li>Chart.js dynamic rendering</li>
</ul>

<hr/>

<h2>📈 Scalability</h2>

<p>This architecture supports:</p>

<ul>
  <li>Multiple producers</li>
  <li>Multiple consumer instances</li>
  <li>Partition-based scaling</li>
  <li>Independent UI scaling</li>
  <li>Event replay using <code>fromBeginning</code></li>
</ul>

<hr/>

<h2>🔥 Production Enhancements (Future Improvements)</h2>

<ul>
  <li>Kafka replication & multi-broker setup</li>
  <li>MongoDB authentication & role-based access</li>
  <li>WebSocket streaming instead of polling</li>
  <li>Horizontal scaling for consumers</li>
  <li>Nginx reverse proxy</li>
  <li>Health checks</li>
  <li>CI/CD pipeline</li>
  <li>Metrics monitoring (Prometheus + Grafana)</li>
</ul>

<hr/>

<h2>🎯 Learning Outcomes</h2>

<ul>
  <li>Understanding Kafka internals</li>
  <li>Debugging container networking</li>
  <li>Handling consumer group coordination</li>
  <li>Building real-time dashboards</li>
  <li>Managing Docker build contexts</li>
  <li>Integrating backend with frontend</li>
</ul>

<hr/>

<p align="center">
⭐ If you found this project helpful, consider giving it a star!
</p>

