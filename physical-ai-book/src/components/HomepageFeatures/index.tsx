import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

type FeatureItem = {
  title: string;
  description: ReactNode;
  stats?: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Comprehensive Physical AI',
    description: (
      <>
        Master the complete stack from fundamentals to advanced applications. 
        Our curriculum covers <b>ROS 2</b>, <b>Computer Vision</b>, and 
        <b>Humanoid Robotics</b> deployment.
      </>
    ),
    stats: '5 MODULES',
  },
  {
    title: 'In-Depth Simulation',
    description: (
      <>
        15 meticulously designed lessons that take you from theory to practice.
        Learn to build "Digital Twins" using <b>NVIDIA Isaac Sim</b> and <b>Gazebo</b>
        before touching real hardware.
      </>
    ),
    stats: '15 LESSONS',
  },
  {
    title: 'Real-World Deployment',
    description: (
      <>
        Build actual Physical AI systems. Learn to integrate sensors, 
        process data in real-time on <b>Jetson Nano</b>, and deploy
        AI models on physical robots.
      </>
    ),
    stats: 'SIM-TO-REAL',
  },
  {
    title: 'Research-Backed Content',
    description: (
      <>
        Content based on the latest research in <b>Embodied AI</b> and 
        <b>Vision-Language-Action (VLA)</b> models used by top tech companies.
      </>
    ),
    stats: 'INDUSTRY STANDARD',
  },
  {
    title: 'Code-First Approach',
    description: (
      <>
        Every concept comes with working code in <b>Python</b> and <b>C++</b>.
        Clone repositories, run simulations, and see your code control
        a robot instantly.
      </>
    ),
    stats: 'HANDS-ON CODING',
  },
  {
    title: 'Future-Ready Career',
    description: (
      <>
        Prepare for the massive demand in Physical AI. Master skills in 
        autonomous systems, SLAM navigation, and human-robot interaction.
      </>
    ),
    stats: 'CAREER GROWTH',
  },
];

function Feature({title, description, stats}: FeatureItem) {
  return (
    <div className={clsx('col col--4 margin-bottom--lg')}>
      <div style={{
        height: '100%',
        padding: '2rem',
        // High Contrast Dark Background
        backgroundColor: '#1b1b1d', 
        // Purple Border for Cyberpunk feel
        border: '1px solid #6200ea', 
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(98, 0, 234, 0.15)', // Purple Glow
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'transform 0.2s ease',
      }}>
        
        {/* Stats Tag */}
        {stats && (
          <span style={{
            backgroundColor: '#3d0091', // Dark Purple Background
            color: '#ffffff', // White Text
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            marginBottom: '1.5rem',
            letterSpacing: '1px',
            border: '1px solid #7e3ff2'
          }}>
            {stats}
          </span>
        )}

        {/* Title - Bright White/Purple */}
        <Heading as="h3" style={{
          marginBottom: '1rem', 
          color: '#b794f9', // Light Purple for readability
          fontSize: '1.5rem'
        }}>
          {title}
        </Heading>
        
        {/* Description - Pure White/Grey */}
        <p style={{
          fontSize: '1.05rem', 
          lineHeight: '1.6', 
          color: '#e0e0e0', // Very Light Grey (Almost White)
          fontWeight: '400'
        }}>
          {description}
        </p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features} style={{padding: '4rem 0'}}>
      <div className="container">
        {/* Main Heading */}
        <div className="text--center margin-bottom--xl">
          <Heading as="h2" style={{
            fontSize: '2.5rem',
            color: '#7e3ff2', // Bright Purple
            marginBottom: '1rem',
            fontWeight: 'bold'
          }}>
            Why Learn Physical AI? 🚀
          </Heading>
          <p style={{
            fontSize: '1.2rem',
            color: '#e0e0e0', // White text
            maxWidth: '800px',
            margin: '0 auto',
          }}>
            Dive into the exciting world where Artificial Intelligence meets the Physical World.
            This guide transforms you into a Robotics Expert.
          </p>
        </div>

        {/* Features Grid */}
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>

        {/* Call to Action Box */}
        <div className="text--center margin-top--xl">
          <div style={{
            padding: '2.5rem',
            backgroundColor: '#121212', // Darker Black
            borderRadius: '15px',
            border: '2px solid #6200ea',
            boxShadow: '0 0 30px rgba(98, 0, 234, 0.2)' // Stronger Glow
          }}>
            <Heading as="h3" style={{color: '#b794f9', marginBottom: '1rem'}}>
              Ready to Start Your Journey? 🎯
            </Heading>
            <p style={{fontSize: '1.2rem', marginBottom: '2rem', color: '#fff'}}>
              Explore 5 comprehensive chapters with 15 detailed lessons designed 
              to make you proficient in Physical AI systems.
            </p>
            
            {/* --- YAHAN CHANGE KIYA HAI --- */}
            <Link 
              to="/docs/learning/classification" 
              className="button button--lg"
              style={{
                marginRight: '1rem',
                backgroundColor: '#6200ea',
                color: 'white',
                border: 'none',
                textDecoration: 'none'
              }}
            >
              Start Learning Now 📖
            </Link>
            {/* ----------------------------- */}

            <a 
              href="https://github.com/physical-ai-book" 
              className="button button--secondary button--lg"
              target="_blank"
              style={{
                backgroundColor: 'transparent',
                border: '2px solid white',
                color: 'white'
              }}
            >
              View on GitHub 💻
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}