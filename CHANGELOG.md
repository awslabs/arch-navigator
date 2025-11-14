# Changelog

All notable changes to Architecture Navigator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial public release
- AWS resource navigation support
- BARN format for normalized resource representation
- Desktop application (Electron)
- Web application (SolidJS + Vite)
- Support for EC2, IAM, S3, Lambda, RDS, DynamoDB, SNS, SQS, ELB, CloudFormation
- Resource relationship mapping
- Credential management with AWS CLI integration

### Known Limitations

- AWS-only support (multi-cloud planned for future releases)
- Some resource types not supported by AWS Cloud Control API (e.g., IAM Policies)

## Release Notes

This is the initial public release of Architecture Navigator. The project provides a unified interface for navigating cloud infrastructure resources.

For detailed information about upcoming features, see the [Roadmap](README.md#roadmap) section in the README.
