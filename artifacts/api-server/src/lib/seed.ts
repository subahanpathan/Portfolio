import bcrypt from "bcrypt";
import { db, usersTable, projectsTable, certificatesTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { logger } from "./logger";

export async function seed() {
  try {
    // 1. Seed Admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@portfolio.com";
    const [adminCount] = await db.select({ value: count() }).from(usersTable).where(eq(usersTable.role, "admin"));
    
    if (adminCount.value === 0) {
      logger.info("Seeding admin user...");
      const passwordHash = await bcrypt.hash("Admin123!", 10);
      await db.insert(usersTable).values({
        email: adminEmail,
        passwordHash,
        name: "Admin",
        role: "admin",
      });
      logger.info("Admin user seeded.");
    }

    // 2. Seed Projects
    const [projectCount] = await db.select({ value: count() }).from(projectsTable);
    if (projectCount.value === 0) {
      logger.info("Seeding default projects...");
      const defaultProjects = [
        {
          title: "NeuroVision",
          shortDesc: "Real-time neural network visualization platform.",
          fullDesc: "NeuroVision is a cutting-edge platform designed for real-time visualization of complex neural networks. It provides researchers and developers with a deep look into the inner workings of AI models, enabling better debugging and optimization.",
          tech: ["React", "Three.js", "TensorFlow.js", "Node.js"],
          category: "AI/ML",
          featured: true,
          githubUrl: "https://github.com",
          liveUrl: "https://neurovision.demo",
          imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
          challenges: "Handling large datasets in real-time while maintaining 60FPS visualization.",
          outcomes: "Reduced model debugging time by 40% for our internal teams."
        },
        {
          title: "RoboCore",
          shortDesc: "Distributed control system for swarm robotics.",
          fullDesc: "RoboCore is a robust distributed control system architecture specifically built for swarm robotics applications. It handles communication, task allocation, and synchronization across hundreds of individual robotic units.",
          tech: ["C++", "ROS", "Python", "MQTT"],
          category: "Robotics",
          featured: true,
          githubUrl: "https://github.com",
          liveUrl: "https://robocore.demo",
          imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
          challenges: "Ensuring low-latency communication in high-density environments.",
          outcomes: "Successfully deployed in a pilot project with 50 autonomous warehouse robots."
        },
        {
          title: "IntelliChat",
          shortDesc: "Enterprise-grade LLM orchestration layer.",
          fullDesc: "IntelliChat provides a secure and scalable orchestration layer for integrating Large Language Models into enterprise workflows. It features prompt management, cost tracking, and fine-grained access control.",
          tech: ["TypeScript", "Next.js", "OpenAI API", "Redis"],
          category: "AI/ML",
          featured: false,
          githubUrl: "https://github.com",
          liveUrl: "https://intellichat.demo",
          imageUrl: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?auto=format&fit=crop&q=80&w=800",
          challenges: "Implementing robust prompt injection protection and PII filtering.",
          outcomes: "Enabled 5 enterprise clients to safely deploy LLM-based internal tools."
        },
        {
          title: "CloudMind",
          shortDesc: "Serverless edge computing framework.",
          fullDesc: "CloudMind is a high-performance framework for deploying serverless functions at the network edge. It minimizes latency by executing code as close to the user as possible, with sub-millisecond cold starts.",
          tech: ["Rust", "WebAssembly", "Go", "gRPC"],
          category: "Cloud",
          featured: true,
          githubUrl: "https://github.com",
          liveUrl: "https://cloudmind.demo",
          imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
          challenges: "Optimizing WebAssembly runtime for multi-tenant isolation.",
          outcomes: "Achieved 30% lower latency compared to traditional regional cloud providers."
        },
        {
          title: "CyberShield",
          shortDesc: "AI-powered threat detection system.",
          fullDesc: "CyberShield uses advanced machine learning algorithms to identify and neutralize network threats in real-time. It analyzes traffic patterns to detect anomalies that signify zero-day exploits or coordinated attacks.",
          tech: ["Python", "PyTorch", "Elasticsearch", "Docker"],
          category: "Security",
          featured: false,
          githubUrl: "https://github.com",
          liveUrl: "https://cybershield.demo",
          imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
          challenges: "Balancing false positive rates with detection sensitivity in high-volume traffic.",
          outcomes: "Stopped over 10,000 automated attack attempts during its first month of deployment."
        }
      ];
      await db.insert(projectsTable).values(defaultProjects);
      logger.info("Projects seeded.");
    }

    // 3. Seed Certificates
    const [certCount] = await db.select({ value: count() }).from(certificatesTable);
    if (certCount.value === 0) {
      logger.info("Seeding default certificates...");
      const defaultCerts = [
        {
          title: "TensorFlow Developer Certificate",
          issuer: "Google",
          date: "2023",
          credentialUrl: "https://google.com/certificate",
          category: "AI/ML",
          description: "Proficiency in building and deploying ML models with TensorFlow."
        },
        {
          title: "AWS Solutions Architect Associate",
          issuer: "Amazon",
          date: "2023",
          credentialUrl: "https://aws.amazon.com/certificate",
          category: "Cloud",
          description: "Design and deployment of scalable systems on AWS."
        },
        {
          title: "ROS Developer Certification",
          issuer: "Open Robotics",
          date: "2022",
          credentialUrl: "https://ros.org/certificate",
          category: "Robotics",
          description: "Expertise in Robot Operating System (ROS) and robot programming."
        },
        {
          title: "Meta React Developer",
          issuer: "Meta",
          date: "2022",
          credentialUrl: "https://coursera.org/certificate",
          category: "Web Dev",
          description: "Advanced frontend development using React and modern ecosystem."
        }
      ];
      await db.insert(certificatesTable).values(defaultCerts);
      logger.info("Certificates seeded.");
    }

  } catch (err) {
    logger.error({ err }, "Seeding failed");
  }
}
