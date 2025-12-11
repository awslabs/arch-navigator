# Architecture Navigator - DESIGN

## Overview

Architecture Navigator provides a unified interface for navigating cloud infrastructure. This document outlines the design philosophy, component architecture, and interaction patterns that enable fluid exploration of resources across accounts, regions, and services.

This document defines the long-term target for Architecture Navigator. The current implementation is intentionally minimal, with a tree view of CloudFormation stacks and basic resource details serving as a foundation for incremental development toward the outlined vision. The application will be built progressively as the project matures.

## Mission

Architecture Navigator democratizes cloud infrastructure understanding by synthesizing complex environments into an intuitive, resource-focused navigation experience. The tool addresses fundamental challenges builders face:

**Navigate Infrastructure Intuitively**
- View all resources with relationships and dependencies in a unified interface
- Browse infrastructure as connected systems, not isolated service silos
- Eliminate the need to piece together information from multiple consoles

**Build and Modify Infrastructure**
- Create new infrastructure from goal-based natural language descriptions
- Connect resources together through intuitive interfaces
- Bridge the gap between guided experiences and repeatable automation workflows
- Validate and preview changes before deployment

**Troubleshoot Faster with Visual Context**
- Quickly navigate actual infrastructure layout to identify root causes
- Find and highlight likely problems with recommended next actions
- Maintain consistent structure from creation through monitoring and troubleshooting

**Understand Infrastructure Across Skill Levels**
- Serve both beginners exploring cloud concepts and experts managing production systems
- Provide immediate "aha" moment showing infrastructure relationships on first use
- Enable progressive learning from simple navigation to advanced operational insights

**Integrate Operational Data Seamlessly**
- Overlay performance, cost, security, and access data directly on resource views
- Consolidate monitoring information into a single interface
- Query and navigate using natural language alongside traditional filtering

The tool is resource-focused and optimized for understanding relationships and navigation, complementing service-specific consoles that focus on configuration and management.

## Interface Vision

```
 arch-navigator ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ SETTINGS

┌-selection----------┐-projection----------------------------------------------┐
┏━━━━━━━━━━━━━━━━━━┓ | ┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ QUERY            ┃ | ┃ PATH                     ┃ ┃ LENSES                   ┃
┗━━━━━━━━━━━━━━━━━━┛ | ┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━┓ | ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ OUTLINE          ┃ | ┃ STATISTICS                                            ┃
┃                  ┃ | ┃                                                       ┃
┃                  ┃ | ┃                                                       ┃
┃                  ┃ | ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
┃                  ┃ | ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ┏━━━━━━━━━━━━━━━┓
┃                  ┃ | ┃ FILTERS                             ┃ ┃ VIEW_SELECTOR ┃
┃                  ┃ | ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ┗━━━━━━━━━━━━━━━┛
┃                  ┃ | ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                  ┃ | ┃ DETAILS                                               ┃
┃                  ┃ | ┃                                                       ┃
┗━━━━━━━━━━━━━━━━━━┛ | ┃                                                       ┃
┏━━━━━━━━━━━━━━━━━━┓ | ┃                                                       ┃
┃ SUMMARY          ┃ | ┃                                                       ┃
┃                  ┃ | ┃                                                       ┃
┃                  ┃ | ┃                                                       ┃
┗━━━━━━━━━━━━━━━━━━┛ | ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
└--------------------┘---------------------------------------------------------┘
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ PROMPT                                                                       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Multi-Panel Design

The tool's interface surface is divided into two primary areas:

- **Selection Panel (Left)**: Tools for finding and selecting resources
- **Projection Panel (Right)**: Detailed views of selected resources

The entire surface is complemented by an AI-powered natural language interface that can manipulate, interrogate, and navigate in the tool.

### Component Descriptions

#### Selection Panel

##### QUERY
- Query builder for defining resource selection criteria
- Query by: resource types, tags, names, relationships, accounts, regions, IaC definitions
- Real-time results populate OUTLINE as query is refined

##### OUTLINE
- Hierarchical tree view of resources matching QUERY
- Expandable/collapsible/selectable nodes showing resource relationships and groupings
- Multiple root contexts supported (accounts, regions, stacks, resource types), based on QUERY
- Visual indicators for resource state (health, security, cost alerts)

##### SUMMARY
- Aggregate statistics for current selection
- Resource counts by type and state
- Cost totals and estimates
- Health, security, and compliance scores

#### Projection Panel

##### PATH
- Breadcrumb navigation showing current selection hierarchy
- Interactive: click any segment to navigate up or pivot to related resources
- Displays chain of related resources showing navigation path
- Example: `Stack:MyApp → RDS:ProductionDB → Lambda:DataProcessor → IAM:ProcessorRole`

##### LENSES
- Persona perspectives that contextualize all data across the interface
- Stackable: apply multiple lenses simultaneously
- Each lens decorates all components with topically relevant information for chosen perspectives
- Available lenses:
  - **Performance**: Latency, throughput, response times, bottlenecks
  - **Utilization**: Resource usage, capacity, efficiency metrics
  - **Security**: Vulnerabilities, compliance, access patterns, threats
  - **Cost**: Spending, optimization opportunities, forecasts
  - **Access**: Permissions, policies, authentication, authorization
  - **Configuration**: Settings, parameters, infrastructure-as-code

##### STATISTICS
- Key performance indicators for selected resources
- Dynamically adapts based on active lenses
- Lens-specific examples:
  - **Security**: Vulnerability count, compliance score, exposed ports, policy violations
  - **Cost**: Monthly spend, cost trends, optimization savings, forecast
  - **Performance**: Latency percentiles (p50/p90/p99), error rates, throughput
  - **Utilization**: CPU/memory usage, capacity remaining, efficiency score

##### FILTERS
- Refine visible resources within current view
- Filter by: type, region, tags, status, age, custom attributes
- Combine filters with boolean logic (AND/OR)
- Filters apply to DETAILS content, not OUTLINE selection

##### VIEW_SELECTOR
- Choose visualization format for DETAILS area
- Available views:
  - **Properties**: Key-value configuration and metadata
  - **Related Items Table**: Tabular list of connected resources
  - **Relationship Graph**: Interactive connection diagram
  - **Logs**: Event logs and activity streams
  - **Timeline**: Resource lifecycle visualization

##### DETAILS
- Primary content area rendering the selected view
- Content shaped by active LENSES and filtered by FILTERS
- View-specific renderings:
  - **Properties**: Key-value pairs, configuration, metadata, tags, IaC references
  - **Related Items Table**: Sortable/filterable table of connected resources
  - **Relationship Graph**: Interactive entity-relationship diagram showing connections across infrastructure
  - **Logs**: Chronological event stream with search, filtering, time-range selection
  - **Timeline**: Visual timeline of lifecycle events (created, modified, accessed, deleted)
- Common features across all views:
  - Click-to-navigate links to related resources
  - Contextual actions (view in console, copy ARN/ID, export, share)
  - Lens-specific details (columns, labels), annotations, highlights, and warnings

##### PROMPT
- Natural language interface for queries and commands
- Translates intent into appropriate SELECTION and PROJECTION configurations
- Example queries:
  - `"Show me all public S3 buckets"` → Sets QUERY, applies Security lens
  - `"What depends on this Lambda function?"` → Switches to Relationship Graph view
  - `"Explain this IAM policy"` → Opens Properties view with AI explanation
  - `"Find unused resources older than 90 days"` → Complex query with filters

## Interaction Flows

Resources are dynamically linked throughout the interface. Selection changes yield fluid shifts in details, showing and hiding content appropriately.

### Basic Navigation Flow
```
Set QUERY
  → Select resources in OUTLINE
  → Choose LENSES
  → Review STATISTICS
  → Select view in VIEW_SELECTOR
  → Explore DETAILS
```

### AI-Assisted Discovery Flow
```
PROMPT: "find expensive resources"
  → QUERY populated
  → OUTLINE filtered
  → Cost lens applied
  → STATISTICS updated
  → Related Items Table displayed
  → DETAILS show resources sorted by cost
```

## Design Principles

1. **Progressive Disclosure**: Show overview first (SELECTION), details on demand (PROJECTION)
2. **Unified Lifecycle View**: Same structure and layout from creation through monitoring and troubleshooting
3. **IaC Fluent**: Treat infrastructure-as-code as a first-class citizen
4. **Connection-Based Navigation**: Browse by resource relationships, not service silos (PATH, Relationship Graph)
5. **Orientation and Wayfinding**: Always maintain context and show where you can go (linking)
6. **Operational Data Layers**: Performance, cost, security, and access data overlaid on resource views (LENSES)
7. **Multiple Perspectives**: Same data, different views (LENSES + VIEW_SELECTOR)
8. **Fluid Navigation**: Click any resource reference to select, act, navigate
9. **Deep Integration**: Provide links to native cloud management consoles and IaC definitions
10. **Natural Language**: Goal-based descriptions drive resource discovery and navigation (PROMPT)

## Future Enhancements
- Immersive, dynamic, contextual interactions
- Real-time resource monitoring
- Change tracking and diff views
- Collaborative annotations
- Custom lens development
- Export/share views
- Integration with IaC tools

---

Designed by Jeoff Wilks and Luke Brassard. 🏴‍☠️
