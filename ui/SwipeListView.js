'use strict';

import React, {
	Component,
	PropTypes,
} from 'react';
import {
	ListView,
	Text,
	View,
} from 'react-native';

import SwipeRow from './SwipeRow.js';

const propTypes = {
	renderRow: PropTypes.func.isRequired,
	renderHiddenRow: PropTypes.func,
	leftOpenValue: PropTypes.number,
	rightOpenValue: PropTypes.number,
	stopLeftSwipe: PropTypes.number,
	stopRightSwipe: PropTypes.number,
	closeOnScroll: PropTypes.bool,
	closeOnRowPress: PropTypes.bool,
	closeOnRowBeginSwipe: PropTypes.bool,
	disableLeftSwipe: PropTypes.bool,
	disableRightSwipe: PropTypes.bool,
	recalculateHiddenLayout: PropTypes.bool,
	onRowOpen: PropTypes.func,
	onRowDidOpen: PropTypes.func,
	onRowClose: PropTypes.func,
	onRowDidClose: PropTypes.func,
	swipeRowStyle: View.propTypes.style,
	listViewRef: PropTypes.func,
	previewFirstRow: PropTypes.bool,
	previewRowIndex: PropTypes.number,
	previewDuration: PropTypes.number,
	previewOpenValue: PropTypes.number,
	friction: PropTypes.number,
	tension: PropTypes.number,
	directionalDistanceChangeThreshold: PropTypes.number,
	swipeToOpenPercent: PropTypes.number,
};


const defaultProps = {
	leftOpenValue: 0,
	rightOpenValue: 0,
	closeOnRowBeginSwipe: false,
	closeOnScroll: true,
	closeOnRowPress: true,
	disableLeftSwipe: false,
	disableRightSwipe: false,
	recalculateHiddenLayout: false,
	previewFirstRow: false,
	directionalDistanceChangeThreshold: 2,
	swipeToOpenPercent: 50
};


class SwipeListView extends Component {

	constructor(props) {
		super(props);
		this._rows = {};
		this.openCellId = null;
	}

	setScrollEnabled(enable) {
		this._listView.setNativeProps({ scrollEnabled: enable });
	}

	safeCloseOpenRow() {
		// if the openCellId is stale due to deleting a row this could be undefined
		if (this._rows[this.openCellId]) {
			this._rows[this.openCellId].closeRow();
		}
	}

	rowSwipeGestureBegan(id) {
		if (this.props.closeOnRowBeginSwipe && this.openCellId && this.openCellId !== id) {
			this.safeCloseOpenRow();
		}
	}

	onRowOpen(secId, rowId, rowMap) {
		const cellIdentifier = `${secId}${rowId}`;
		if (this.openCellId && this.openCellId !== cellIdentifier) {
			this.safeCloseOpenRow();
		}
		this.openCellId = cellIdentifier;
		this.props.onRowOpen && this.props.onRowOpen(secId, rowId, rowMap);
	}

	onRowPress(id) {
		if (this.openCellId) {
			if (this.props.closeOnRowPress) {
				this.safeCloseOpenRow();
				this.openCellId = null;
			}
		}
	}

	onScroll(e) {
		if (this.openCellId) {
			if (this.props.closeOnScroll) {
				this.safeCloseOpenRow();
				this.openCellId = null;
			}
		}
		this.props.onScroll && this.props.onScroll(e);
	}

	setRefs(ref) {
		this._listView = ref;
		this.props.listViewRef && this.props.listViewRef(ref);
	}

	renderRow(rowData, secId, rowId, rowMap) {
		if (rowData) {
			const Component = this.props.renderRow(rowData, secId, rowId, rowMap);
			if (!this.props.renderHiddenRow) {
				return React.cloneElement(
					Component,
					{
						...Component.props,
						ref: row => this._rows[`${secId}${rowId}`] = row,
						onRowOpen: _ => this.onRowOpen(secId, rowId, this._rows),
						onRowDidOpen: _ => this.props.onRowDidOpen && this.props.onRowDidOpen(secId, rowId, this._rows),
						onRowClose: _ => this.props.onRowClose && this.props.onRowClose(secId, rowId, this._rows),
						onRowDidClose: _ => this.props.onRowDidClose && this.props.onRowDidClose(secId, rowId, this._rows),
						onRowPress: _ => this.onRowPress(`${secId}${rowId}`),
						setScrollEnabled: enable => this.setScrollEnabled(enable),
						swipeGestureBegan: _ => this.rowSwipeGestureBegan(`${secId}${rowId}`)
					}
				);
			} else {
				const previewRowId = this.props.dataSource && this.props.dataSource.getRowIDForFlatIndex(this.props.previewRowIndex || 0);
				return (
					<SwipeRow
						ref={row => this._rows[`${secId}${rowId}`] = row}
						swipeGestureBegan={_ => this.rowSwipeGestureBegan(`${secId}${rowId}`)}
						onRowOpen={_ => this.onRowOpen(secId, rowId, this._rows)}
						onRowDidOpen={_ => this.props.onRowDidOpen && this.props.onRowDidOpen(secId, rowId, this._rows)}
						onRowClose={_ => this.props.onRowClose && this.props.onRowClose(secId, rowId, this._rows)}
						onRowDidClose={_ => this.props.onRowDidClose && this.props.onRowDidClose(secId, rowId, this._rows)}
						onRowPress={_ => this.onRowPress(`${secId}${rowId}`)}
						setScrollEnabled={(enable) => this.setScrollEnabled(enable)}
						leftOpenValue={this.props.leftOpenValue}
						rightOpenValue={this.props.rightOpenValue}
						closeOnRowPress={this.props.closeOnRowPress}
						disableLeftSwipe={this.props.disableLeftSwipe}
						disableRightSwipe={this.props.disableRightSwipe}
						stopLeftSwipe={this.props.stopLeftSwipe}
						stopRightSwipe={this.props.stopRightSwipe}
						recalculateHiddenLayout={this.props.recalculateHiddenLayout}
						style={this.props.swipeRowStyle}
						preview={(this.props.previewFirstRow || this.props.previewRowIndex) && rowId === previewRowId}
						previewDuration={this.props.previewDuration}
						previewOpenValue={this.props.previewOpenValue}
						tension={this.props.tension}
						friction={this.props.friction}
						directionalDistanceChangeThreshold={this.props.directionalDistanceChangeThreshold}
						swipeToOpenPercent={this.props.swipeToOpenPercent}
					>
						{this.props.renderHiddenRow(rowData, secId, rowId, this._rows)}
						{this.props.renderRow(rowData, secId, rowId, this._rows)}
					</SwipeRow>
				);
			}
		} else {
			return null;
		}
	}

	render() {
		return (
			<ListView
				{...this.props}
				ref={c => this.setRefs(c)}
				onScroll={e => this.onScroll(e)}
				renderRow={(rowData, secId, rowId) => this.renderRow(rowData, secId, rowId, this._rows)}
			/>
		)
	}

}

SwipeListView.propTypes = propTypes;
SwipeListView.defaultProps = defaultProps;

export default SwipeListView;